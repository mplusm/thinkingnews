import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import NewsCard from '@/components/NewsCard'
import { fetchNews } from '@/lib/api'
import { Article } from '@/lib/types'
import { RefreshCw } from 'lucide-react'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  let articles: Article[] = []
  let error: string | null = null

  try {
    const data = await fetchNews(1, 50)
    articles = data.articles
  } catch (e) {
    error = 'Failed to load news. Please try again later.'
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 mb-4">{error}</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <RefreshCw size={16} /> Refresh
            </a>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 mb-2">No news articles yet.</p>
            <p className="text-zinc-500 text-sm">Check back soon!</p>
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
      <CookieConsent />
    </div>
  )
}
