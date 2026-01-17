'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  // Show placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        aria-label="Toggle theme"
      >
        <Sun size={20} />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200 transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
