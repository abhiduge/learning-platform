import { motion } from 'framer-motion'

export function QuizHint({ hint, loading, error }) {
  if (!loading && !hint && !error) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-card border border-primary-light bg-primary-light px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <p className="text-xs font-heading font-700 text-primary uppercase tracking-widest mb-1">
        💡 Hint
      </p>
      {loading && (
        <p className="text-sm font-body text-primary/70 animate-pulse">Getting a clue…</p>
      )}
      {hint && (
        <p className="text-sm font-body text-[#0f172a] leading-relaxed">
          Here's a clue to help you think it through: {hint}
        </p>
      )}
      {error && (
        <p className="text-sm font-body text-muted">{error}</p>
      )}
    </motion.div>
  )
}
