import { ArticleListResponse } from './types'

// Use internal URL for server-side fetching
const API_URL = typeof window === 'undefined'
  ? 'http://127.0.0.1:8001'
  : (process.env.NEXT_PUBLIC_API_URL || '')

export interface FetchNewsParams {
  page?: number
  limit?: number
  source?: string
  q?: string
  time?: string
}

export async function fetchNews(params: FetchNewsParams = {}): Promise<ArticleListResponse> {
  const { page = 1, limit = 20, source, q, time } = params

  const searchParams = new URLSearchParams()
  searchParams.set('page', page.toString())
  searchParams.set('limit', limit.toString())
  if (source) searchParams.set('source', source)
  if (q) searchParams.set('q', q)
  if (time) searchParams.set('time', time)

  const res = await fetch(`${API_URL}/api/v1/news?${searchParams.toString()}`, {
    next: { revalidate: 60 }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch news')
  }

  return res.json()
}

export async function fetchSources(): Promise<{ name: string }[]> {
  const res = await fetch(`${API_URL}/api/v1/sources`, {
    next: { revalidate: 3600 }
  })

  if (!res.ok) {
    return []
  }

  return res.json()
}

export async function fetchTrending(limit: number = 10): Promise<ArticleListResponse> {
  const res = await fetch(`${API_URL}/api/v1/news/trending?limit=${limit}`, {
    next: { revalidate: 300 }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch trending')
  }

  return res.json()
}
