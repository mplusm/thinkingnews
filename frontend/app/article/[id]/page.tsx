import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Clock } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Article } from '@/lib/types'

const API_URL = 'http://127.0.0.1:8001'

async function getArticle(id: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/news/${id}`, {
      next: { revalidate: 3600 }
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = await getArticle(params.id)

  if (!article) {
    return {
      title: 'Article Not Found - ThinkingNews',
    }
  }

  const description = article.summary || `Read about ${article.title} on ThinkingNews`

  return {
    title: `${article.title} - ThinkingNews`,
    description,
    keywords: ['tech news', 'AI news', article.source, 'technology'],
    authors: [{ name: article.source }],
    openGraph: {
      title: article.title,
      description,
      url: `https://tn.thinkingdbx.com/article/${article.id}`,
      siteName: 'ThinkingNews',
      type: 'article',
      publishedTime: article.published_at || article.created_at,
      images: article.image_url ? [{ url: article.image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.image_url ? [article.image_url] : [],
    },
    alternates: {
      canonical: `https://tn.thinkingdbx.com/article/${article.id}`,
    },
  }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)

  if (!article) {
    notFound()
  }

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: article.image_url || undefined,
    datePublished: article.published_at || article.created_at,
    dateModified: article.created_at,
    author: {
      '@type': 'Organization',
      name: article.source,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ThinkingNews',
      url: 'https://tn.thinkingdbx.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tn.thinkingdbx.com/article/${article.id}`,
    },
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to feed
        </Link>

        <article className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
              {article.source}
            </span>
            {publishedDate && (
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Clock size={12} /> {publishedDate}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full rounded-lg mb-6 object-cover max-h-96"
            />
          )}

          {article.summary && (
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 text-lg leading-relaxed">
                {article.summary}
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors font-medium"
            >
              Read full article <ExternalLink size={16} />
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
