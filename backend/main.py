from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from contextlib import asynccontextmanager
import logging

from database import get_db, engine
from models import Article, Source
from schemas import ArticleResponse, ArticleListResponse, SourceResponse, HealthResponse
from fetcher import fetch_all_feeds

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("ThinkingNews API starting up")
    yield
    logger.info("ThinkingNews API shutting down")


app = FastAPI(
    title="ThinkingNews API",
    description="AI-powered tech news in 60 words or less",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tn.thinkingdbx.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/api/v1/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint."""
    try:
        db.execute(func.now())
        db_status = "up"
    except:
        db_status = "down"

    return HealthResponse(
        status="healthy" if db_status == "up" else "unhealthy",
        database=db_status,
        version="1.0.0"
    )


@app.get("/api/v1/news", response_model=ArticleListResponse)
def get_news(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    source: str | None = None,
    db: Session = Depends(get_db)
):
    """Get latest news articles."""
    query = db.query(Article).filter(Article.is_active == True)

    if source:
        query = query.filter(Article.source == source)

    total = query.count()
    offset = (page - 1) * limit

    articles = query.order_by(desc(Article.created_at)).offset(offset).limit(limit).all()

    return ArticleListResponse(
        articles=[ArticleResponse.model_validate(a) for a in articles],
        total=total,
        page=page,
        limit=limit,
        has_next=(offset + limit) < total
    )


@app.get("/api/v1/news/{article_id}", response_model=ArticleResponse)
def get_article(article_id: str, db: Session = Depends(get_db)):
    """Get a single article by ID."""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return ArticleResponse.model_validate(article)


@app.get("/api/v1/sources", response_model=list[SourceResponse])
def get_sources(db: Session = Depends(get_db)):
    """Get all news sources."""
    sources = db.query(Source).order_by(Source.name).all()
    return [SourceResponse.model_validate(s) for s in sources]


@app.post("/api/v1/fetch")
def trigger_fetch(db: Session = Depends(get_db)):
    """Manually trigger news fetch (for testing/cron)."""
    results = fetch_all_feeds(db)
    return results


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
