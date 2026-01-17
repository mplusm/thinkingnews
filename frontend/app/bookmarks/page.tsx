'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Trash2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import { Article } from '@/lib/types'

export default function BookmarksPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookmarks = async () => {
      const bookmarkIds = JSON.parse(localStorage.getItem('bookmarks') || '[]')

      if (bookmarkIds.length === 0) {
        setLoading(false)
        return
      }

      // Fetch each bookmarked article
      const fetchedArticles: Article[] = []
      for (const id of bookmarkIds) {
        try {
          const res = await fetch(`/api/v1/news/${id}`)
          if (res.ok) {
            const article = await res.json()
            fetchedArticles.push(article)
          }
        } catch (e) {
          console.error('Failed to fetch bookmark:', id)
        }
      }

      setArticles(fetchedArticles)
      setLoading(false)
    }

    loadBookmarks()
  }, [])

  const clearAllBookmarks = () => {
    if (confirm('Are you sure you want to clear all bookmarks?')) {
      localStorage.setItem('bookmarks', '[]')
      setArticles([])
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bookmark className="text-yellow-500" size={24} />
            <h1 className="text-2xl font-bold text-white">Bookmarks</h1>
          </div>
          {articles.length > 0 && (
            <button
              onClick={clearAllBookmarks}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} /> Clear all
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">Loading bookmarks...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-lg">
            <Bookmark className="mx-auto text-zinc-600 mb-4" size={48} />
            <p className="text-zinc-400 mb-2">No bookmarks yet</p>
            <p className="text-zinc-500 text-sm">
              Click the bookmark icon on any article to save it here
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
