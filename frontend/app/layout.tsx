import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tn.thinkingdbx.com'),
  title: {
    default: 'ThinkingNews - AI & Tech News in 60 Words or Less',
    template: '%s | ThinkingNews',
  },
  description: 'Stay informed with AI-powered tech news summaries. Get the latest in artificial intelligence, technology, and startups - each story condensed to 60 words or less.',
  keywords: ['tech news', 'AI news', 'technology news', 'artificial intelligence', 'startup news', 'tech summary', 'news aggregator', 'AI summarization'],
  authors: [{ name: 'ThinkingDBx', url: 'https://thinkingdbx.com' }],
  creator: 'ThinkingDBx',
  publisher: 'ThinkingDBx',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'ThinkingNews - AI & Tech News in 60 Words',
    description: 'AI-powered tech news summaries. Stay informed without the noise.',
    url: 'https://tn.thinkingdbx.com',
    siteName: 'ThinkingNews',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThinkingNews - AI & Tech News in 60 Words',
    description: 'AI-powered tech news summaries. Stay informed without the noise.',
  },
  alternates: {
    canonical: 'https://tn.thinkingdbx.com',
    types: {
      'application/rss+xml': 'https://tn.thinkingdbx.com/feed.xml',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'add-your-google-verification-code-here',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-63XEVWRY48"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-63XEVWRY48');
          `}
        </Script>
      </head>
      <body className={`${inter.className} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  )
}
