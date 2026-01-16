export default function LoadingCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 w-20 bg-zinc-800 rounded"></div>
        <div className="h-5 w-5 bg-zinc-800 rounded"></div>
      </div>
      <div className="h-6 bg-zinc-800 rounded mb-2"></div>
      <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-zinc-800 rounded mb-2"></div>
      <div className="h-4 bg-zinc-800 rounded mb-2"></div>
      <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
    </div>
  )
}
