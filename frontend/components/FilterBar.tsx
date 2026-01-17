'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FilterBarProps {
  sources: string[]
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export interface FilterState {
  search: string
  source: string
  time: string
}

const TIME_OPTIONS = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
]

export default function FilterBar({ sources, onFilterChange, initialFilters }: FilterBarProps) {
  const [search, setSearch] = useState(initialFilters?.search || '')
  const [source, setSource] = useState(initialFilters?.source || '')
  const [time, setTime] = useState(initialFilters?.time || '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Trigger filter change
  useEffect(() => {
    onFilterChange({ search: debouncedSearch, source, time })
  }, [debouncedSearch, source, time, onFilterChange])

  const clearSearch = () => {
    setSearch('')
  }

  const hasFilters = search || source || time

  const clearAllFilters = () => {
    setSearch('')
    setSource('')
    setTime('')
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 transition-colors"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3">
        {/* Source filter */}
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
        >
          <option value="">All Sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Time filter */}
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
