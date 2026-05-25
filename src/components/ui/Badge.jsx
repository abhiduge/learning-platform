import { BADGE_DEFS } from '../../lib/badges'

export function Badge({ badgeId, earned = false, size = 'md' }) {
  const def = BADGE_DEFS.find((b) => b.id === badgeId)
  if (!def) return null

  const sizes = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center shadow-card transition-all ${
          earned
            ? 'bg-accent/20 ring-2 ring-accent'
            : 'bg-gray-100 grayscale opacity-40'
        }`}
        title={def.description}
      >
        {def.emoji}
      </div>
      <p className={`text-xs font-heading font-700 text-center leading-tight max-w-[56px] ${earned ? 'text-[#0f172a]' : 'text-muted'}`}>
        {def.name}
      </p>
    </div>
  )
}
