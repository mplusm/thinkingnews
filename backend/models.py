from sqlalchemy import Column, String, Text, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid


class Article(Base):
    __tablename__ = "articles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = Column(Text, unique=True, nullable=False)
    title = Column(Text, nullable=False)
    original_content = Column(Text)
    summary = Column(Text)
    source = Column(String(100), nullable=False)
    source_url = Column(Text)
    author = Column(String(255))
    published_at = Column(DateTime(timezone=True))
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())
    image_url = Column(Text)
    content_hash = Column(String(64), unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Source(Base):
    __tablename__ = "sources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    url = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    last_fetched_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
