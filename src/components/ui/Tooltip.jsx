import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function Tooltip({ term, definition }) {
  const [open, setOpen] = useState(false)

  return (
    <span className="inline-flex items-baseline gap-1 relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-0.5 bg-primary-light text-primary rounded-full px-2 py-0.5 text-sm font-heading font-700 min-h-[28px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-expanded={open}
        aria-label={`Definition of ${term}`}
      >
        {term}
        <span className="text-xs ml-0.5">{open ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 z-10 w-64 bg-[#0f172a] text-white text-sm font-body rounded-card px-4 py-3 shadow-card-lg"
            role="tooltip"
          >
            <span className="font-heading font-700 text-accent">{term}: </span>
            {definition}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
