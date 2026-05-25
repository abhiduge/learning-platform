import { motion } from 'framer-motion'
import { getLevelForXp, LEVELS } from '../../lib/xpSystem'

export function XPCounter({ totalXp }) {
  const current = getLevelForXp(totalXp)
  const nextLevel = LEVELS.find((l) => l.minXp > totalXp)

  const bandStart = current.minXp
  const bandEnd = nextLevel ? nextLevel.minXp : current.minXp + 1
  const progress = nextLevel
    ? ((totalXp - bandStart) / (bandEnd - bandStart)) * 100
    : 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-heading font-700 text-sm text-primary">{current.name}</span>
        <span className="font-mono text-xs text-muted">
          {totalXp} XP{nextLevel ? ` / ${nextLevel.minXp}` : ' · MAX'}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {nextLevel && (
        <p className="text-xs text-muted font-body mt-0.5 text-right">
          {nextLevel.minXp - totalXp} XP to {nextLevel.name}
        </p>
      )}
    </div>
  )
}
