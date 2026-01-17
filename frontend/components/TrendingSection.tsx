'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, ChevronRight } from 'lucide-react'
import { Article } from '@/lib/types'

export default function TrendingSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/v1/news/trending?limit=5')
        if (res.ok) {
          const data = await res.json()
          setArticles(data.articles || [])
        }
      } catch (e) {
        console.error('Failed to fetch trending:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  if (loading || articles.length === 0) return null

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-yellow-500" size={20} />
        <h2 className="font-semibold text-white">Trending Now</h2>
      </div>

      <div className="space-y-3">
        {articles.slice(0, 5).map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="flex items-start gap-3 group"
          >
            <span className="text-2xl font-bold text-zinc-700 group-hover:text-yellow-500 transition-colors w-6">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white group-hover:text-yellow-500 transition-colors line-clamp-2">
                {article.title}
              </p>
              <span className="text-xs text-zinc-500">{article.source}</span>
            </div>
            <ChevronRight size={16} className="text-zinc-600 group-hover:text-yellow-500 transition-colors mt-1 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
