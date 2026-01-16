from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class ArticleResponse(BaseModel):
    id: UUID
    title: str
    summary: Optional[str]
    source: str
    source_url: Optional[str]
    url: str
    published_at: Optional[datetime]
    image_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ArticleListResponse(BaseModel):
    articles: list[ArticleResponse]
    total: int
    page: int
    limit: int
    has_next: bool


class SourceResponse(BaseModel):
    id: UUID
    name: str
    url: str
    is_active: bool
    last_fetched_at: Optional[datetime]

    class Config:
        from_attributes = True


class HealthResponse(BaseModel):
    status: str
    database: str
    version: str
