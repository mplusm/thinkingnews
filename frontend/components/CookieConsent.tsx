'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-zinc-400 text-sm text-center sm:text-left">
          We use cookies to enhance your experience and analyze site traffic. By continuing, you agree to our use of cookies.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
