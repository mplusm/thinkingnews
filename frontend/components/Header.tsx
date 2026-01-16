import { Zap } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-500" size={24} />
            <h1 className="text-xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
              Thinking<span className="text-yellow-500">News</span>
            </h1>
          </div>
          <p className="text-xs text-zinc-500 hidden sm:block">
            AI & Tech News in 60 words or less
          </p>
        </div>
      </div>
    </header>
  )
}
