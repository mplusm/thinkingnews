import { Article, ArticleListResponse, Source } from './types';

const API_URL = 'https://tn.thinkingdbx.com';

export interface FetchNewsParams {
  page?: number;
  limit?: number;
  source?: string;
  q?: string;
  time?: string;
}

export async function fetchNews(params: FetchNewsParams = {}): Promise<ArticleListResponse> {
  const { page = 1, limit = 20, source, q, time } = params;

  const searchParams = new URLSearchParams();
  searchParams.set('page', page.toString());
  searchParams.set('limit', limit.toString());
  if (source) searchParams.set('source', source);
  if (q) searchParams.set('q', q);
  if (time && time !== 'all') searchParams.set('time', time);

  const res = await fetch(`${API_URL}/api/v1/news?${searchParams.toString()}`);

  if (!res.ok) {
    throw new Error('Failed to fetch news');
  }

  return res.json();
}

export async function fetchArticle(id: string): Promise<Article> {
  const res = await fetch(`${API_URL}/api/v1/news/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch article');
  }

  return res.json();
}

export async function fetchSources(): Promise<Source[]> {
  const res = await fetch(`${API_URL}/api/v1/sources`);

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function fetchTrending(limit: number = 5): Promise<ArticleListResponse> {
  const res = await fetch(`${API_URL}/api/v1/news/trending?limit=${limit}`);

  if (!res.ok) {
    throw new Error('Failed to fetch trending');
  }

  return res.json();
}
