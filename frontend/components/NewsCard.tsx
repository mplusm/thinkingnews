'use client'

import { Article } from '@/lib/types'
import { ExternalLink, Bookmark } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useState, useEffect } from 'react'

interface NewsCardProps {
  article: Article
}

export default function NewsCard({ article }: NewsCardProps) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setBookmarked(bookmarks.includes(article.id))
  }, [article.id])

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    if (bookmarked) {
      const filtered = bookmarks.filter((id: string) => id !== article.id)
      localStorage.setItem('bookmarks', JSON.stringify(filtered))
    } else {
      bookmarks.push(article.id)
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
    setBookmarked(!bookmarked)
  }

  const timeAgo = article.created_at
    ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true })
    : ''

  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start gap-3 mb-3">
        <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
          {article.source}
        </span>
        <button
          onClick={toggleBookmark}
          className="text-zinc-500 hover:text-yellow-500 transition-colors"
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} className={bookmarked ? 'text-yellow-500' : ''} />
        </button>
      </div>

      <h2 className="text-lg font-semibold text-white mb-3 line-clamp-2 leading-tight">
        {article.title}
      </h2>

      {article.summary && (
        <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
          {article.summary}
        </p>
      )}

      <div className="flex justify-between items-center text-xs text-zinc-500">
        <span>{timeAgo}</span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
        >
          Read original <ExternalLink size={12} />
        </a>
      </div>
    </article>
  )
}
