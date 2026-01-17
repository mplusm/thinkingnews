import { NextResponse } from 'next/server'

const API_URL = 'http://127.0.0.1:8001'

interface Article {
  id: string
  title: string
  summary: string | null
  source: string
  url: string
  created_at: string
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/v1/news?limit=50`, {
      next: { revalidate: 300 }
    })

    if (!res.ok) {
      throw new Error('Failed to fetch articles')
    }

    const data = await res.json()
    const articles: Article[] = data.articles || []

    const rssItems = articles.map((article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>https://tn.thinkingdbx.com/article/${article.id}</link>
      <guid isPermaLink="true">https://tn.thinkingdbx.com/article/${article.id}</guid>
      <description>${escapeXml(article.summary || '')}</description>
      <source url="${escapeXml(article.url)}">${escapeXml(article.source)}</source>
      <pubDate>${new Date(article.created_at).toUTCString()}</pubDate>
    </item>`).join('')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ThinkingNews - AI Tech News</title>
    <link>https://tn.thinkingdbx.com</link>
    <description>AI-powered tech news summarized in 60 words or less</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://tn.thinkingdbx.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    })
  } catch (error) {
    return new NextResponse('Error generating feed', { status: 500 })
  }
}
