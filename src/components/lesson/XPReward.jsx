import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { BADGE_DEFS } from '../../lib/badges'
import { getLevelForXp } from '../../lib/xpSystem'

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (target === 0) return
    const start = performance.now()
    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return count
}

export function XPReward({ xpEarned, score, newBadgeIds = [], prevXp = 0, onComplete }) {
  const displayed = useCountUp(xpEarned)
  const [showLevelUp, setShowLevelUp] = useState(false)

  const prevLevel = getLevelForXp(prevXp).level
  const newLevel = getLevelForXp(prevXp + xpEarned).level
  const didLevelUp = newLevel > prevLevel

  useEffect(() => {
    if (didLevelUp) {
      const t = setTimeout(() => setShowLevelUp(true), 1400)
      return () => clearTimeout(t)
    }
  }, [didLevelUp])

  const scoreLabel =
    score === 3 ? '🌟 Perfect score!' : score === 2 ? '👍 Good work!' : '💪 Keep going!'

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-story-bg px-4 py-8"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
          className="text-7xl"
        >
          🏆
        </motion.div>

        <div className="text-center">
          <p className="text-story-text font-body text-base mb-2">Lesson complete!</p>
          <h2 className="font-heading font-800 text-4xl text-accent">
            +<span className="font-mono">{displayed}</span>
            <span className="text-2xl ml-1">XP</span>
          </h2>
        </div>

        <div className="bg-white/10 rounded-card px-6 py-4 w-full text-center">
          <p className="text-story-text font-heading font-700 text-lg">{scoreLabel}</p>
          <p className="text-story-text/70 font-body text-sm mt-1">Quiz score: {score}/3</p>
        </div>

        {/* Level-up banner */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-accent rounded-card px-6 py-4 w-full text-center"
            >
              <p className="font-heading font-800 text-white text-lg">
                ⬆️ Level {newLevel} — {getLevelForXp(prevXp + xpEarned).name}!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New badges */}
        {newBadgeIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full"
          >
            <p className="text-story-text/60 font-body text-xs text-center uppercase tracking-widest mb-3">
              New badge{newBadgeIds.length > 1 ? 's' : ''} earned!
            </p>
            <div className="flex justify-center gap-6">
              {newBadgeIds.map((id) => {
                const def = BADGE_DEFS.find((b) => b.id === id)
                return def ? (
                  <div key={id} className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-full bg-accent/20 ring-2 ring-accent flex items-center justify-center text-3xl">
                      {def.emoji}
                    </div>
                    <p className="text-white font-heading font-700 text-xs text-center max-w-[56px] leading-tight">{def.name}</p>
                  </div>
                ) : null
              })}
            </div>
          </motion.div>
        )}

        <p className="text-story-text/60 font-body text-xs text-center">
          Come back tomorrow for the next lesson →
        </p>
      </div>

      <div className="max-w-md mx-auto w-full pt-4">
        <Button onClick={onComplete} variant="accent" className="w-full">
          Finish →
        </Button>
      </div>
    </motion.div>
  )
}
