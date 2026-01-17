'use client'

import { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { Loader2 } from 'lucide-react'
import NewsCard from './NewsCard'
import FilterBar, { FilterState } from './FilterBar'
import TrendingSection from './TrendingSection'
import { Article } from '@/lib/types'

interface NewsFeedProps {
  initialArticles: Article[]
  initialTotal: number
  sources: string[]
}

export default function NewsFeed({ initialArticles, initialTotal, sources }: NewsFeedProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialArticles.length < initialTotal)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<FilterState>({ search: '', source: '', time: '' })
  const [total, setTotal] = useState(initialTotal)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  // Fetch articles with current filters
  const fetchArticles = useCallback(async (pageNum: number, currentFilters: FilterState, append: boolean = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', pageNum.toString())
      params.set('limit', '20')
      if (currentFilters.source) params.set('source', currentFilters.source)
      if (currentFilters.search) params.set('q', currentFilters.search)
      if (currentFilters.time) params.set('time', currentFilters.time)

      const res = await fetch(`/api/v1/news?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()

      if (append) {
        setArticles(prev => [...prev, ...data.articles])
      } else {
        setArticles(data.articles)
      }

      setTotal(data.total)
      setHasMore(data.has_next)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setPage(1)
    fetchArticles(1, newFilters, false)
  }, [fetchArticles])

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchArticles(nextPage, filters, true)
    }
  }, [inView, hasMore, loading, page, filters, fetchArticles])

  const hasActiveFilters = filters.search || filters.source || filters.time

  return (
    <div>
      <FilterBar
        sources={sources}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {/* Trending section - only show when no filters active */}
      {!hasActiveFilters && <TrendingSection />}

      {/* Results count */}
      <div className="flex justify-between items-center mb-4 text-sm text-zinc-500">
        <span>{total} articles</span>
        {filters.search && (
          <span>Results for "{filters.search}"</span>
        )}
      </div>

      {/* Articles grid */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-2">No articles found</p>
          <p className="text-zinc-500 text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Load more trigger */}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {loading && (
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          )}
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <p className="text-center text-zinc-500 text-sm py-8">
          You've reached the end
        </p>
      )}
    </div>
  )
}
