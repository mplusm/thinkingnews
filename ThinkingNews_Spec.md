# ThinkingNews - AI-Powered Tech News Summarization Platform
## Complete Project Specification Document

**Project Name:** ThinkingNews  
**Domain:** tn.thinkingdbx.com  
**Version:** 1.0.0  
**Target:** Web (MVP) → Mobile Apps (Phase 2)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Product Requirements](#product-requirements)
3. [Technical Architecture](#technical-architecture)
4. [Tech Stack](#tech-stack)
5. [Database Schema](#database-schema)
6. [API Specifications](#api-specifications)
7. [Infrastructure Setup](#infrastructure-setup)
8. [Implementation Plan](#implementation-plan)
9. [Deployment Guide](#deployment-guide)
10. [Environment Configuration](#environment-configuration)

---

## 1. Project Overview

### Vision
Real-time AI and tech news summarization platform delivering bite-sized (≤60 words) news updates from multiple sources, powered by open-source AI models.

### Core Features (MVP)
- Real-time news aggregation from RSS feeds and APIs
- AI-powered summarization (max 60 words)
- Infinite scroll news feed
- Bookmark functionality
- Source attribution
- Responsive web design
- SEO optimized

### Future Features (Phase 2)
- User authentication
- Personalized feeds
- Mobile apps (iOS/Android)
- Push notifications
- Search functionality
- Category filtering

---

## 2. Product Requirements

### Functional Requirements

#### FR1: News Aggregation
- System fetches news from multiple sources every 15 minutes
- Sources include: RSS feeds, NewsAPI, Reddit API
- Deduplication based on URL and content similarity
- Support for at least 10 news sources initially

#### FR2: AI Summarization
- Each article summarized to maximum 60 words
- Preserve key technical facts and context
- Include source attribution
- Handle various article lengths (100-5000 words)

#### FR3: User Interface
- Infinite scroll feed showing latest news
- Each card displays: title, summary, source, timestamp, bookmark button
- Mobile-responsive design
- Fast page load (<2s)

#### FR4: Bookmarking
- Anonymous bookmarking (localStorage initially)
- Bookmark icon toggle
- Separate bookmarks page
- Persist across sessions

#### FR5: SEO & Discovery
- Dynamic meta tags per article
- Sitemap generation
- RSS feed output
- Open Graph tags
- Schema.org structured data

### Non-Functional Requirements

#### NFR1: Performance
- Page load time: <2 seconds
- API response time: <500ms
- Support 1000 concurrent users
- 99.5% uptime

#### NFR2: Scalability
- Handle 10,000 articles/day
- Process 2000 summarizations/hour
- Database growth: ~1GB/month

#### NFR3: Reliability
- Automatic retry for failed API calls
- Graceful degradation if AI service down
- Database backups daily

#### NFR4: Security
- Rate limiting on API endpoints
- Input sanitization
- HTTPS only
- CORS configuration

---

## 3. Technical Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │ Nginx   │
                    │ Reverse │
                    │ Proxy   │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
   │ Next.js  │    │ FastAPI  │    │  Redis   │
   │ Frontend │◄───┤ Backend  │◄───┤  Cache   │
   │ (SSR)    │    │   API    │    └──────────┘
   └──────────┘    └────┬─────┘
                        │
                   ┌────▼─────┐
                   │PostgreSQL│
                   │ Database │
                   └──────────┘

External Services:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Groq API  │  │  NewsAPI    │  │ RSS Feeds   │
│  (AI Model) │  │             │  │ (Multiple)  │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Component Architecture

#### Frontend (Next.js)
```
/app
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home page (news feed)
├── bookmarks/
│   └── page.tsx            # Bookmarks page
├── article/[id]/
│   └── page.tsx            # Individual article page (SEO)
└── api/
    ├── news/route.ts       # Proxy to backend
    └── bookmark/route.ts   # Bookmark management
```

#### Backend (FastAPI)
```
/backend
├── main.py                 # FastAPI app entry
├── routers/
│   ├── news.py             # News endpoints
│   └── health.py           # Health check
├── services/
│   ├── news_fetcher.py     # RSS/API aggregation
│   ├── summarizer.py       # AI summarization
│   ├── deduplicator.py     # Content deduplication
│   └── cache.py            # Redis caching
├── models/
│   ├── article.py          # Pydantic models
│   └── database.py         # SQLAlchemy models
├── database/
│   └── connection.py       # DB connection pool
└── utils/
    ├── config.py           # Environment config
    └── logger.py           # Logging setup
```

### Data Flow

**News Aggregation Flow:**
```
Cron Job (Every 15min)
    ↓
Fetch RSS/APIs → Parse Content → Check Duplicates (Redis)
    ↓
New Articles → Queue for Summarization
    ↓
Groq API (Batch Process) → Generate Summaries
    ↓
Store in PostgreSQL → Invalidate Cache
    ↓
Available to Frontend
```

**User Request Flow:**
```
User Request (tn.thinkingdbx.com)
    ↓
Nginx → Next.js SSR
    ↓
Check Redis Cache → (HIT) Return Cached
    ↓
(MISS) FastAPI Backend
    ↓
Query PostgreSQL → Return Data
    ↓
Cache in Redis (5min TTL)
    ↓
Render to User
```

---

## 4. Tech Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with SSR |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| TailwindCSS | 3.x | Styling |
| React Query | 5.x | Data fetching & caching |
| Zustand | 4.x | State management (bookmarks) |
| date-fns | 3.x | Date formatting |
| lucide-react | Latest | Icons |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Backend language |
| FastAPI | 0.110+ | API framework |
| SQLAlchemy | 2.x | ORM |
| Alembic | 1.x | Database migrations |
| Pydantic | 2.x | Data validation |
| feedparser | 6.x | RSS parsing |
| requests | 2.x | HTTP client |
| redis-py | 5.x | Redis client |
| psycopg2 | 2.x | PostgreSQL driver |
| APScheduler | 3.x | Background jobs |
| groq | Latest | Groq API client |

### Infrastructure Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 15+ | Primary database |
| Redis | 7+ | Caching & rate limiting |
| Nginx | 1.24+ | Reverse proxy |
| Docker | 24+ | Containerization |
| Docker Compose | 2.x | Orchestration |
| Certbot | Latest | SSL certificates |

### AI/ML Stack
| Service | Model | Purpose |
|---------|-------|---------|
| Groq | llama-3.1-70b-versatile | Primary summarization |
| Mistral AI | mistral-small-latest | Fallback option |
| Local Ollama | llama3.2:3b | Offline fallback |

### News Sources
| Source | Type | Rate Limit |
|--------|------|------------|
| NewsAPI.org | REST API | 100 req/day (free) |
| TechCrunch | RSS | Unlimited |
| The Verge | RSS | Unlimited |
| Ars Technica | RSS | Unlimited |
| Hacker News | RSS | Unlimited |
| VentureBeat | RSS | Unlimited |
| MIT Technology Review | RSS | Unlimited |
| Reddit r/artificial | API | 60 req/min |
| Reddit r/technology | API | 60 req/min |
| Wired | RSS | Unlimited |

---

## 5. Database Schema

### PostgreSQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Articles table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    original_content TEXT,
    summary TEXT NOT NULL,
    source VARCHAR(100) NOT NULL,
    source_url TEXT,
    author VARCHAR(255),
    published_at TIMESTAMP WITH TIME ZONE,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    category VARCHAR(50) DEFAULT 'general',
    content_hash VARCHAR(64) UNIQUE NOT NULL,  -- For deduplication
    word_count INTEGER,
    read_time_minutes INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_source ON articles(source);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_articles_content_hash ON articles(content_hash);
CREATE INDEX idx_articles_is_active ON articles(is_active);

-- Sources table (for managing RSS feeds)
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,  -- 'rss', 'api', 'scraper'
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    fetch_interval_minutes INTEGER DEFAULT 15,
    last_fetched_at TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    error_count INTEGER DEFAULT 0,
    article_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sources_is_active ON sources(is_active);

-- Summarization jobs table (for tracking AI jobs)
CREATE TABLE summarization_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,  -- 'pending', 'processing', 'completed', 'failed'
    model_used VARCHAR(50),
    input_tokens INTEGER,
    output_tokens INTEGER,
    processing_time_ms INTEGER,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_jobs_status ON summarization_jobs(status);
CREATE INDEX idx_jobs_article_id ON summarization_jobs(article_id);

-- Analytics table (for tracking popular articles)
CREATE TABLE article_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    view_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id)
);

CREATE INDEX idx_analytics_article_id ON article_analytics(article_id);

-- User bookmarks table (future use with auth)
CREATE TABLE user_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,  -- Anonymous ID or user ID
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

CREATE INDEX idx_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX idx_bookmarks_article_id ON user_bookmarks(article_id);

-- System logs table
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL,  -- 'info', 'warning', 'error'
    component VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_logs_level ON system_logs(level);
CREATE INDEX idx_logs_created_at ON system_logs(created_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON article_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Redis Data Structures

```
# Cache Keys Structure
article_cache:{article_id}      # Individual article (TTL: 1 hour)
feed_cache:latest:{page}        # Latest articles feed (TTL: 5 minutes)
feed_cache:category:{cat}:{page}# Category feeds (TTL: 5 minutes)
source_cache:{source_name}      # Source metadata (TTL: 1 hour)

# Deduplication Keys
dedup:url:{url_hash}            # URL deduplication (TTL: 7 days)
dedup:content:{content_hash}    # Content deduplication (TTL: 7 days)

# Rate Limiting Keys
ratelimit:api:{ip}              # API rate limits (TTL: 1 minute)
ratelimit:groq:{timestamp}      # Groq API rate limit (TTL: 1 minute)

# Job Queue
job_queue:summarization         # List for pending summarization jobs

# Statistics
stats:daily:{date}              # Daily statistics (TTL: 30 days)
stats:sources:{source}:{date}   # Per-source stats (TTL: 30 days)
```

---

## 6. API Specifications

### Backend API (FastAPI)

#### Base URL
```
http://localhost:8000/api/v1
```

#### Endpoints

##### 1. Get Latest News
```http
GET /news/latest
```

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20, max: 100): Items per page
- `category` (string, optional): Filter by category
- `source` (string, optional): Filter by source

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "uuid",
        "title": "Article Title",
        "summary": "60-word summary...",
        "source": "TechCrunch",
        "source_url": "https://...",
        "published_at": "2025-01-15T10:30:00Z",
        "image_url": "https://...",
        "category": "ai",
        "read_time_minutes": 3
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

##### 2. Get Article by ID
```http
GET /news/{article_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Article Title",
    "summary": "60-word summary...",
    "original_content": "Full original content...",
    "source": "TechCrunch",
    "source_url": "https://...",
    "author": "John Doe",
    "published_at": "2025-01-15T10:30:00Z",
    "image_url": "https://...",
    "category": "ai",
    "word_count": 1500,
    "read_time_minutes": 6,
    "analytics": {
      "view_count": 45,
      "bookmark_count": 12
    }
  }
}
```

##### 3. Get Trending Articles
```http
GET /news/trending
```

**Query Parameters:**
- `limit` (integer, default: 10, max: 50): Number of articles
- `period` (string: "24h"|"7d"|"30d", default: "24h"): Time period

**Response:** Same structure as latest news

##### 4. Search Articles
```http
GET /news/search
```

**Query Parameters:**
- `q` (string, required): Search query
- `page` (integer): Page number
- `limit` (integer): Items per page

**Response:** Same structure as latest news

##### 5. Get Sources
```http
GET /sources
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "TechCrunch",
      "type": "rss",
      "url": "https://...",
      "is_active": true,
      "article_count": 234,
      "last_fetched_at": "2025-01-15T11:00:00Z"
    }
  ]
}
```

##### 6. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T11:00:00Z",
  "services": {
    "database": "up",
    "redis": "up",
    "groq_api": "up"
  },
  "version": "1.0.0"
}
```

##### 7. Get Statistics
```http
GET /stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_articles": 5234,
    "articles_today": 156,
    "total_sources": 10,
    "active_sources": 9,
    "cache_hit_rate": 0.87,
    "avg_summary_time_ms": 450
  }
}
```

### Frontend API Routes (Next.js)

These are client-side accessible routes:

```
GET  /api/news/latest?page=1&limit=20
GET  /api/news/[id]
GET  /api/news/trending
GET  /api/search?q=ai
POST /api/bookmarks (Add bookmark)
GET  /api/bookmarks (Get user bookmarks)
DELETE /api/bookmarks/[id] (Remove bookmark)
```

---

## 7. Infrastructure Setup

### Domain Configuration (Namecheap)

1. **DNS Records:**
```
Type: A Record
Host: tn
Value: YOUR_SERVER_IP
TTL: Automatic

Type: CNAME
Host: www.tn
Value: tn.thinkingdbx.com
TTL: Automatic
```

2. **Propagation:** Wait 5-30 minutes for DNS propagation

### Nginx Configuration

**File:** `/etc/nginx/sites-available/thinkingnews.conf`

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name tn.thinkingdbx.com www.tn.thinkingdbx.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tn.thinkingdbx.com www.tn.thinkingdbx.com;

    # SSL certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/tn.thinkingdbx.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tn.thinkingdbx.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_status 429;

    # Next.js Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # FastAPI Backend
    location /api/v1 {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (if needed)
        add_header 'Access-Control-Allow-Origin' '$http_origin' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
        
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Static files (if serving from Nginx)
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        proxy_cache_bypass $http_pragma $http_authorization;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://localhost:8000/api/v1/health;
    }

    # Block common attack vectors
    location ~ /\.(?!well-known) {
        deny all;
    }
}
```

### Docker Compose Configuration

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: thinkingnews_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - thinkingnews_network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: thinkingnews_redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - thinkingnews_network

  # FastAPI Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: thinkingnews_backend
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0
      - GROQ_API_KEY=${GROQ_API_KEY}
      - NEWSAPI_KEY=${NEWSAPI_KEY}
      - ENVIRONMENT=production
      - LOG_LEVEL=info
    volumes:
      - ./backend:/app
      - backend_logs:/app/logs
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - thinkingnews_network

  # Next.js Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_API_URL=https://tn.thinkingdbx.com/api/v1
    container_name: thinkingnews_frontend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://tn.thinkingdbx.com/api/v1
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - thinkingnews_network

  # Background Job Scheduler
  scheduler:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: thinkingnews_scheduler
    restart: unless-stopped
    command: python -m scheduler.main
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0
      - GROQ_API_KEY=${GROQ_API_KEY}
      - NEWSAPI_KEY=${NEWSAPI_KEY}
      - ENVIRONMENT=production
    volumes:
      - ./backend:/app
      - scheduler_logs:/app/logs
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - thinkingnews_network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  backend_logs:
    driver: local
  scheduler_logs:
    driver: local

networks:
  thinkingnews_network:
    driver: bridge
```

### SSL Certificate Setup

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d tn.thinkingdbx.com -d www.tn.thinkingdbx.com

# Auto-renewal (add to crontab)
sudo crontab -e
# Add this line:
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## 8. Implementation Plan

### Phase 1: Foundation Setup (Week 1)

#### Day 1-2: Infrastructure Setup
- [ ] Set up Linux server environment
- [ ] Install Docker and Docker Compose
- [ ] Configure DNS records on Namecheap
- [ ] Set up Nginx with SSL certificates
- [ ] Create project directory structure
- [ ] Initialize Git repository

#### Day 3-4: Database Setup
- [ ] Set up PostgreSQL database
- [ ] Run initial migration scripts
- [ ] Set up Redis cache
- [ ] Test database connections
- [ ] Create database backup script

#### Day 5-7: Backend Development
- [ ] Initialize FastAPI project
- [ ] Implement database models (SQLAlchemy)
- [ ] Create RSS feed parser
- [ ] Integrate Groq API for summarization
- [ ] Implement deduplication logic
- [ ] Create API endpoints (CRUD operations)
- [ ] Add Redis caching layer
- [ ] Write unit tests

### Phase 2: Core Features (Week 2)

#### Day 8-10: News Aggregation
- [ ] Add RSS feed sources (10+ sources)
- [ ] Implement NewsAPI integration
- [ ] Create background job scheduler (APScheduler)
- [ ] Set up 15-minute fetch intervals
- [ ] Implement error handling and retries
- [ ] Add logging and monitoring

#### Day 11-12: AI Summarization
- [ ] Fine-tune summarization prompts (60-word limit)
- [ ] Implement batch processing for efficiency
- [ ] Add fallback mechanisms (Mistral/Ollama)
- [ ] Rate limit handling for Groq API
- [ ] Quality checks for summaries
- [ ] Performance optimization

#### Day 13-14: Frontend Development - Part 1
- [ ] Initialize Next.js 15 project
- [ ] Set up TailwindCSS
- [ ] Create layout components
- [ ] Build news feed page with infinite scroll
- [ ] Implement article card component
- [ ] Add responsive design

### Phase 3: User Features (Week 3)

#### Day 15-16: Frontend Development - Part 2
- [ ] Implement bookmarking functionality (localStorage)
- [ ] Create bookmarks page
- [ ] Add loading states and skeletons
- [ ] Error handling and user feedback
- [ ] Search functionality (future-ready)
- [ ] Category filtering UI

#### Day 17-18: SEO & Performance
- [ ] Implement dynamic meta tags
- [ ] Create sitemap generator
- [ ] Add Open Graph tags
- [ ] Schema.org structured data
- [ ] RSS feed output
- [ ] Optimize images with Next.js Image
- [ ] Implement caching strategies
- [ ] Add service worker (PWA basics)

#### Day 19-20: Testing & QA
- [ ] Write integration tests
- [ ] Perform load testing (1000 concurrent users)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] SEO validation
- [ ] Accessibility audit (WCAG)
- [ ] Security testing
- [ ] Performance optimization

### Phase 4: Deployment & Launch (Week 4)

#### Day 21-22: Deployment
- [ ] Build Docker images
- [ ] Deploy to production server
- [ ] Configure Nginx properly
- [ ] Set up monitoring (logs, metrics)
- [ ] Configure automated backups
- [ ] Test production environment
- [ ] Set up error tracking (Sentry optional)

#### Day 23-24: Pre-Launch
- [ ] Populate database with initial articles
- [ ] Test all user flows
- [ ] Monitor system performance
- [ ] Create user documentation
- [ ] Prepare launch announcement

#### Day 25: Launch
- [ ] Go live on tn.thinkingdbx.com
- [ ] Monitor for issues
- [ ] Gather initial user feedback
- [ ] Hot fixes if needed

#### Day 26-30: Post-Launch
- [ ] Monitor performance metrics
- [ ] Optimize based on usage patterns
- [ ] Fix bugs and issues
- [ ] Gather user feedback
- [ ] Plan Phase 2 features

---

## 9. Deployment Guide

### Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl nginx certbot python3-certbot-nginx

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step-by-Step Deployment

#### 1. Clone Repository

```bash
# Create project directory
mkdir -p /var/www/thinkingnews
cd /var/www/thinkingnews

# Clone your repository (replace with your repo URL)
git clone https://github.com/yourusername/thinkingnews.git .

# Create necessary directories
mkdir -p backend/logs scheduler/logs frontend/.next
```

#### 2. Environment Configuration

```bash
# Create .env file
nano .env
```

Paste the environment variables (see section 10)

#### 3. Configure Nginx

```bash
# Copy Nginx config
sudo nano /etc/nginx/sites-available/thinkingnews

# Paste the Nginx configuration from section 7

# Enable site
sudo ln -s /etc/nginx/sites-available/thinkingnews /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### 4. SSL Certificate

```bash
# Obtain certificate
sudo certbot --nginx -d tn.thinkingdbx.com -d www.tn.thinkingdbx.com

# Follow prompts and select redirect HTTP to HTTPS
```

#### 5. Database Initialization

```bash
# Start PostgreSQL and Redis only
docker-compose up -d postgres redis

# Wait for services to be healthy
sleep 10

# Run migrations
docker-compose exec postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -f /docker-entrypoint-initdb.d/init.sql
```

#### 6. Build and Start Services

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### 7. Verify Deployment

```bash
# Check backend health
curl http://localhost:8000/api/v1/health

# Check frontend
curl http://localhost:3000

# Check via public domain
curl https://tn.thinkingdbx.com/health
```

#### 8. Initial Data Population

```bash
# Trigger first news fetch manually
docker-compose exec backend python -m scripts.initial_fetch

# Or wait for scheduled job (runs every 15 minutes)
```

### Useful Commands

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Update code
git pull
docker-compose down
docker-compose build
docker-compose up -d

# Database backup
docker-compose exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup_$(date +%Y%m%d).sql

# Database restore
cat backup_20250115.sql | docker-compose exec -T postgres psql -U $POSTGRES_USER $POSTGRES_DB
```

---

## 10. Environment Configuration

### Root `.env` File

Create this file at the project root: `/var/www/thinkingnews/.env`

```bash
# Project Configuration
PROJECT_NAME=ThinkingNews
ENVIRONMENT=production
DEBUG=false

# Domain Configuration
DOMAIN=tn.thinkingdbx.com
PROTOCOL=https

# PostgreSQL Database
POSTGRES_DB=thinkingnews_db
POSTGRES_USER=thinkingnews_user
POSTGRES_PASSWORD=your_secure_password_here_change_this
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}

# Redis Configuration
REDIS_PASSWORD=your_redis_password_here_change_this
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0

# AI API Keys
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile
GROQ_MAX_TOKENS=100
GROQ_TEMPERATURE=0.3

# Fallback AI (Optional)
MISTRAL_API_KEY=your_mistral_api_key_here
OLLAMA_BASE_URL=http://localhost:11434

# News APIs
NEWSAPI_KEY=your_newsapi_key_here

# Reddit API (Optional)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=ThinkingNews/1.0

# Application Settings
FETCH_INTERVAL_MINUTES=15
ARTICLES_PER_PAGE=20
MAX_ARTICLES_PER_FETCH=50
CACHE_TTL_SECONDS=300
SUMMARY_MAX_WORDS=60

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
GROQ_RATE_LIMIT_PER_MINUTE=30

# Logging
LOG_LEVEL=info
LOG_FILE=/app/logs/app.log

# Security
SECRET_KEY=your_secret_key_here_change_this_to_something_random
ALLOWED_HOSTS=tn.thinkingdbx.com,www.tn.thinkingdbx.com,localhost
CORS_ORIGINS=https://tn.thinkingdbx.com,https://www.tn.thinkingdbx.com

# Next.js Configuration
NEXT_PUBLIC_API_URL=https://tn.thinkingdbx.com/api/v1
NEXT_PUBLIC_SITE_NAME=ThinkingNews
NEXT_PUBLIC_SITE_DESCRIPTION=AI-powered tech news in 60 words or less
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Docker Configuration
COMPOSE_PROJECT_NAME=thinkingnews
```

### Backend Environment Variables

If needed separately: `backend/.env`

```bash
# Database
DATABASE_URL=postgresql://thinkingnews_user:password@postgres:5432/thinkingnews_db

# Redis
REDIS_URL=redis://:password@redis:6379/0

# APIs
GROQ_API_KEY=your_groq_api_key
NEWSAPI_KEY=your_newsapi_key

# Settings
ENVIRONMENT=production
LOG_LEVEL=info
FETCH_INTERVAL_MINUTES=15
```

### Frontend Environment Variables

If needed separately: `frontend/.env.production`

```bash
NEXT_PUBLIC_API_URL=https://tn.thinkingdbx.com/api/v1
NEXT_PUBLIC_SITE_NAME=ThinkingNews
NEXT_PUBLIC_SITE_DESCRIPTION=AI-powered tech news in 60 words or less
NEXT_PUBLIC_DOMAIN=tn.thinkingdbx.com
```

---

## 11. Key Files Structure

### Complete Project Structure

```
thinkingnews/
├── docker-compose.yml
├── .env
├── .gitignore
├── README.md
├── ARCHITECTURE.md
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env
│   ├── main.py
│   ├── config.py
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── news.py
│   │   ├── sources.py
│   │   └── health.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── news_fetcher.py
│   │   ├── summarizer.py
│   │   ├── deduplicator.py
│   │   ├── cache.py
│   │   └── analytics.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── article.py
│   │   ├── source.py
│   │   └── database.py
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── connection.py
│   │   └── init.sql
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logger.py
│   │   └── helpers.py
│   │
│   ├── scheduler/
│   │   ├── __init__.py
│   │   └── main.py
│   │
│   ├── scripts/
│   │   ├── initial_fetch.py
│   │   └── seed_sources.py
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_api.py
│   │   ├── test_fetcher.py
│   │   └── test_summarizer.py
│   │
│   └── logs/
│       └── .gitkeep
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── .env.production
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── bookmarks/
│   │   │   └── page.tsx
│   │   │
│   │   ├── article/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── news/
│   │       │   └── route.ts
│   │       └── bookmarks/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── NewsCard.tsx
│   │   ├── NewsFeed.tsx
│   │   ├── BookmarkButton.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LoadingCard.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── hooks/
│   │   ├── useNews.ts
│   │   ├── useBookmarks.ts
│   │   └── useInfiniteScroll.ts
│   │
│   ├── store/
│   │   └── bookmarkStore.ts
│   │
│   └── public/
│       ├── favicon.ico
│       ├── logo.svg
│       └── manifest.json
│
└── nginx/
    └── thinkingnews.conf
```

---

## 12. Monitoring & Maintenance

### Monitoring Checklist

#### Daily Checks
- [ ] Check service health: `curl https://tn.thinkingdbx.com/health`
- [ ] Review error logs: `docker-compose logs --tail=100 backend`
- [ ] Check disk space: `df -h`
- [ ] Verify article count: Query database

#### Weekly Checks
- [ ] Review Groq API usage
- [ ] Check database size and performance
- [ ] Review cache hit rates
- [ ] Check for failed fetches
- [ ] Update dependencies (security patches)

#### Monthly Checks
- [ ] Database backup verification
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Cost analysis
- [ ] User feedback review

### Backup Strategy

```bash
# Daily automated backup (add to crontab)
0 2 * * * /var/www/thinkingnews/scripts/backup.sh

# backup.sh script
#!/bin/bash
BACKUP_DIR="/backups/thinkingnews"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker-compose exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

### Performance Optimization Tips

1. **Database Indexing**: Regularly analyze slow queries
2. **Redis Cache**: Monitor hit/miss rates
3. **API Rate Limits**: Implement exponential backoff
4. **Image Optimization**: Use CDN for article images
5. **Bundle Size**: Keep frontend bundle <200KB

---

## 13. Future Enhancements (Phase 2)

### Mobile Apps (React Native)
- iOS and Android native apps
- Push notifications for breaking news
- Offline reading mode
- Native share functionality

### User Authentication
- Email/password registration
- Social login (Google, Twitter)
- User profiles
- Cross-device sync

### Personalization
- ML-based recommendation engine
- User interest tagging
- Reading history
- Personalized news feed

### Advanced Features
- Newsletter subscription
- Text-to-speech
- Dark mode
- Multi-language support
- API for third-party integrations

### Analytics & Insights
- User engagement metrics
- Popular topics tracking
- A/B testing framework
- Revenue analytics (if monetizing)

---

## 14. Success Metrics

### Technical KPIs
- **Uptime**: >99.5%
- **Page Load Time**: <2 seconds
- **API Response Time**: <500ms
- **Cache Hit Rate**: >80%
- **Error Rate**: <0.1%

### Business KPIs
- **Daily Active Users**: Target 1000 (Month 3)
- **Articles Published**: >100/day
- **Average Session Duration**: >3 minutes
- **Bookmark Rate**: >10% of views
- **Retention Rate**: >40% (Week 2)

### Content Quality KPIs
- **Summary Accuracy**: >95% (manual review)
- **Deduplication Rate**: >90%
- **Source Diversity**: 10+ active sources
- **Fetch Success Rate**: >98%

---

## 15. Troubleshooting Guide

### Common Issues

#### 1. Services Won't Start
```bash
# Check logs
docker-compose logs

# Rebuild images
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### 2. Database Connection Errors
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection string
docker-compose exec backend env | grep DATABASE_URL

# Restart database
docker-compose restart postgres
```

#### 3. Groq API Rate Limits
- Implement exponential backoff in `summarizer.py`
- Switch to Mistral API temporarily
- Queue articles for later processing

#### 4. Nginx 502 Bad Gateway
```bash
# Check if backend is running
curl http://localhost:8000/api/v1/health

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

#### 5. SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

---

## 16. Contact & Support

### Documentation
- Technical Docs: `docs/` folder
- API Reference: `/api/v1/docs` (Swagger UI)
- Architecture Diagram: See Section 3

### Getting Help
- GitHub Issues: For bug reports
- Email: support@thinkingdbx.com
- Documentation: README.md

---

## 17. License & Credits

### Open Source Credits
- Next.js by Vercel
- FastAPI by Sebastián Ramírez
- TailwindCSS by Tailwind Labs
- PostgreSQL by PostgreSQL Global Development Group
- Redis by Redis Ltd.

### AI Models
- Llama 3.1 by Meta AI (via Groq)
- Mistral AI by Mistral AI

### License
MIT License - See LICENSE file for details

---

## Appendix A: Sample Code Snippets

### Sample Summarization Prompt

```python
SUMMARIZATION_PROMPT = """
You are a tech news summarizer. Your task is to create a concise, informative summary.

Requirements:
- Maximum 60 words
- Preserve key facts, numbers, and names
- Write in clear, objective language
- Focus on the most newsworthy elements
- Avoid opinion or speculation

Article:
{article_content}

Summary (60 words max):
"""
```

### Sample API Call (Frontend)

```typescript
// lib/api.ts
export async function fetchLatestNews(page: number = 1) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/news/latest?page=${page}&limit=20`,
    { next: { revalidate: 300 } } // Cache for 5 minutes
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  
  return response.json();
}
```

---

## Appendix B: RSS Feed Sources

```python
RSS_SOURCES = [
    {
        "name": "TechCrunch",
        "url": "https://techcrunch.com/feed/",
        "category": "general"
    },
    {
        "name": "The Verge",
        "url": "https://www.theverge.com/rss/index.xml",
        "category": "general"
    },
    {
        "name": "Ars Technica",
        "url": "https://feeds.arstechnica.com/arstechnica/index",
        "category": "general"
    },
    {
        "name": "Hacker News",
        "url": "https://news.ycombinator.com/rss",
        "category": "general"
    },
    {
        "name": "VentureBeat",
        "url": "https://venturebeat.com/feed/",
        "category": "general"
    },
    {
        "name": "MIT Technology Review",
        "url": "https://www.technologyreview.com/feed/",
        "category": "general"
    },
    {
        "name": "Wired",
        "url": "https://www.wired.com/feed/rss",
        "category": "general"
    },
    {
        "name": "AI News (MIT)",
        "url": "https://news.mit.edu/rss/topic/artificial-intelligence2",
        "category": "ai"
    },
    {
        "name": "TechMeme",
        "url": "https://www.techmeme.com/feed.xml",
        "category": "general"
    },
    {
        "name": "ZDNet",
        "url": "https://www.zdnet.com/news/rss.xml",
        "category": "general"
    }
]
```

---

**END OF SPECIFICATION DOCUMENT**

This document should be treated as the single source of truth for the ThinkingNews project. All implementation should follow these specifications unless explicitly changed through the change management process.

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Ready for Implementation

