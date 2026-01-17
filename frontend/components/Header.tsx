'use client'

import Link from 'next/link'
import { Zap, Bookmark } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="text-yellow-500" size={24} />
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white font-[family-name:var(--font-space-grotesk)]">
              Thinking<span className="text-yellow-500">News</span>
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-xs text-zinc-500 hidden md:block mr-2">
              AI & Tech News in 60 words or less
            </p>
            <Link
              href="/bookmarks"
              className="p-2 rounded-lg text-zinc-400 hover:text-yellow-500 hover:bg-zinc-800 transition-colors"
              title="Bookmarks"
            >
              <Bookmark size={20} />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
