import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import NewsFeed from '@/components/NewsFeed'
import { fetchNews, fetchSources } from '@/lib/api'
import { Article } from '@/lib/types'
import { RefreshCw } from 'lucide-react'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  let articles: Article[] = []
  let total = 0
  let sources: string[] = []
  let error: string | null = null

  try {
    const [newsData, sourcesData] = await Promise.all([
      fetchNews({ page: 1, limit: 20 }),
      fetchSources()
    ])
    articles = newsData.articles
    total = newsData.total
    sources = sourcesData.map(s => s.name)
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
        ) : (
          <NewsFeed
            initialArticles={articles}
            initialTotal={total}
            sources={sources}
          />
        )}
      </main>

      <Footer />
      <CookieConsent />
    </div>
  )
}
