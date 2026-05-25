import { motion } from 'framer-motion'
import { BADGE_DEFS } from '../../lib/badges'

export function MilestoneNotice({ newBadgeIds }) {
  if (!newBadgeIds || newBadgeIds.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-accent/10 border border-accent/30 rounded-card px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <p className="font-heading font-700 text-sm text-[#0f172a] mb-2">
        🎉 New milestone{newBadgeIds.length > 1 ? 's' : ''} earned!
      </p>
      <div className="flex gap-3 flex-wrap">
        {newBadgeIds.map((id) => {
          const def = BADGE_DEFS.find((b) => b.id === id)
          return def ? (
            <span
              key={id}
              className="inline-flex items-center gap-1.5 bg-accent/20 text-[#92400e] rounded-full px-3 py-1 text-xs font-heading font-700"
            >
              {def.emoji} {def.name}
            </span>
          ) : null
        })}
      </div>
    </motion.div>
  )
}
