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
  title: 'ThinkingNews - AI Tech News in 60 Words',
  description: 'AI-powered tech news summarized in 60 words or less. Stay informed without the noise.',
  keywords: ['tech news', 'AI news', 'technology', 'artificial intelligence', 'news summary'],
  openGraph: {
    title: 'ThinkingNews',
    description: 'AI-powered tech news in 60 words or less',
    url: 'https://tn.thinkingdbx.com',
    siteName: 'ThinkingNews',
    type: 'website',
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
