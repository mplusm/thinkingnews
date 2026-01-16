import feedparser
import httpx
import hashlib
import logging
from datetime import datetime, timezone
from time import mktime
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Article, Source
from summarizer import summarize_article

logger = logging.getLogger(__name__)


def parse_date(entry) -> datetime | None:
    """Parse date from feed entry."""
    for attr in ['published_parsed', 'updated_parsed']:
        parsed = getattr(entry, attr, None)
        if parsed:
            try:
                return datetime.fromtimestamp(mktime(parsed), tz=timezone.utc)
            except:
                pass
    return None


def get_content(entry) -> str:
    """Extract content from feed entry."""
    if hasattr(entry, 'content') and entry.content:
        return entry.content[0].get('value', '')
    if hasattr(entry, 'summary'):
        return entry.summary or ''
    if hasattr(entry, 'description'):
        return entry.description or ''
    return ''


def get_image(entry) -> str | None:
    """Extract image URL from feed entry."""
    # Check media content
    if hasattr(entry, 'media_content') and entry.media_content:
        for media in entry.media_content:
            if media.get('url'):
                return media['url']

    # Check media thumbnail
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        for thumb in entry.media_thumbnail:
            if thumb.get('url'):
                return thumb['url']

    # Check enclosures
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enc in entry.enclosures:
            if enc.get('type', '').startswith('image'):
                return enc.get('url')

    return None


def fetch_feed(source: Source, db: Session, max_articles: int = 10) -> int:
    """Fetch and process articles from a single RSS feed."""
    added = 0

    try:
        # Fetch feed with timeout
        response = httpx.get(source.url, timeout=30, follow_redirects=True)
        feed = feedparser.parse(response.text)

        if not feed.entries:
            logger.warning(f"No entries found for {source.name}")
            return 0

        for entry in feed.entries[:max_articles]:
            try:
                url = entry.get('link', '')
                title = entry.get('title', '')

                if not url or not title:
                    continue

                # Generate content hash for deduplication
                content = get_content(entry)
                hash_input = f"{url}{title}"
                content_hash = hashlib.sha256(hash_input.encode()).hexdigest()

                # Check if article exists
                exists = db.query(Article).filter(
                    (Article.content_hash == content_hash) | (Article.url == url)
                ).first()

                if exists:
                    continue

                # Get summary
                summary = summarize_article(content, title)

                # Create article
                article = Article(
                    url=url,
                    title=title,
                    original_content=content[:5000] if content else None,
                    summary=summary,
                    source=source.name,
                    source_url=source.url,
                    author=entry.get('author'),
                    published_at=parse_date(entry),
                    image_url=get_image(entry),
                    content_hash=content_hash,
                )

                db.add(article)
                db.commit()
                added += 1
                logger.info(f"Added: {title[:50]}...")

            except Exception as e:
                db.rollback()
                logger.error(f"Error processing entry: {e}")
                continue

        # Update source last_fetched_at
        source.last_fetched_at = func.now()
        db.commit()

    except Exception as e:
        logger.error(f"Error fetching {source.name}: {e}")

    return added


def fetch_all_feeds(db: Session) -> dict:
    """Fetch articles from all active sources."""
    sources = db.query(Source).filter(Source.is_active == True).all()

    results = {"total_added": 0, "sources_processed": 0, "errors": []}

    for source in sources:
        try:
            added = fetch_feed(source, db)
            results["total_added"] += added
            results["sources_processed"] += 1
            logger.info(f"{source.name}: added {added} articles")
        except Exception as e:
            results["errors"].append(f"{source.name}: {str(e)}")
            logger.error(f"Failed to fetch {source.name}: {e}")

    return results
