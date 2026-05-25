import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-6 text-center gap-6">
      <div className="text-6xl">📉</div>
      <h1 className="font-heading font-800 text-2xl text-[#0f172a]">Page not found</h1>
      <p className="font-body text-muted text-base">This page took a wrong turn — just like a bad investment.</p>
      <Link to="/" className="text-primary font-heading font-700 underline">
        ← Back to home
      </Link>
    </div>
  )
}
