import { ArticleListResponse } from './types'

// Use internal URL for server-side fetching
const API_URL = typeof window === 'undefined'
  ? 'http://127.0.0.1:8001'
  : (process.env.NEXT_PUBLIC_API_URL || '')

export async function fetchNews(page: number = 1, limit: number = 20): Promise<ArticleListResponse> {
  const res = await fetch(`${API_URL}/api/v1/news?page=${page}&limit=${limit}`, {
    next: { revalidate: 60 } // Cache for 60 seconds
  })

  if (!res.ok) {
    throw new Error('Failed to fetch news')
  }

  return res.json()
}
