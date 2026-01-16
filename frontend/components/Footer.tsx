export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-8 mt-8">
      <div className="max-w-4xl mx-auto px-4 text-center text-zinc-500 text-sm space-y-3">
        <p className="text-zinc-400">
          <span className="font-[family-name:var(--font-space-grotesk)]">ThinkingNews</span>
          {' '}by{' '}
          <a
            href="https://thinkingdbx.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-space-grotesk)] text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            ThinkingDBx
          </a>
        </p>
        <p>&copy; 2025 ThinkingDBx. All rights reserved.</p>
        <p className="text-zinc-600 text-xs">
          Leeway MR Prime, Survey No -6, 2/91/20, Whitefields, Kondapur, Hyderabad, Telangana - 500084, India
        </p>
        <p className="text-zinc-600 text-xs">
          CIN: U62011TS2025PTC206211 | GSTIN: 36AAMCT4502D1ZJ
        </p>
      </div>
    </footer>
  )
}
