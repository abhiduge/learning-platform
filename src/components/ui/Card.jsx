export function Card({ children, className = '', dark = false }) {
  const base = 'rounded-card shadow-card p-6'
  const theme = dark
    ? 'bg-story-bg text-story-text'
    : 'bg-surface text-[#0f172a]'

  return <div className={`${base} ${theme} ${className}`}>{children}</div>
}
