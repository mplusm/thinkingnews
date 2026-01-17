import { MetadataRoute } from 'next'

const API_URL = 'http://127.0.0.1:8001'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tn.thinkingdbx.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
  ]

  // Fetch articles for dynamic pages
  try {
    const res = await fetch(`${API_URL}/api/v1/news?limit=100`, {
      next: { revalidate: 3600 }
    })

    if (res.ok) {
      const data = await res.json()
      const articles = data.articles || []

      const articlePages: MetadataRoute.Sitemap = articles.map((article: any) => ({
        url: `${baseUrl}/article/${article.id}`,
        lastModified: new Date(article.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

      return [...staticPages, ...articlePages]
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return staticPages
}
