'use client'

import { useState } from 'react'
import { Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  compact?: boolean
}

export default function ShareButtons({ url, title, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const buttonClass = compact
    ? 'p-1.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors'
    : 'p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors'

  const iconSize = compact ? 14 : 18

  return (
    <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'}`}>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on X (Twitter)"
        title="Share on X"
      >
        <Twitter size={iconSize} />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <Linkedin size={iconSize} />
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <Facebook size={iconSize} />
      </a>
      <button
        onClick={copyToClipboard}
        className={buttonClass}
        aria-label="Copy link"
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? <Check size={iconSize} className="text-green-500" /> : <Link2 size={iconSize} />}
      </button>
    </div>
  )
}
