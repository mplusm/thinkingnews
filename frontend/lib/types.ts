export interface Article {
  id: string
  title: string
  summary: string | null
  source: string
  source_url: string | null
  url: string
  published_at: string | null
  image_url: string | null
  created_at: string
}

export interface ArticleListResponse {
  articles: Article[]
  total: number
  page: number
  limit: number
  has_next: boolean
}
