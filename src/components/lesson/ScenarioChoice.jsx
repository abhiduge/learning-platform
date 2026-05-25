import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

export function ScenarioChoice({ scenario, onChoose }) {
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-[#f8fafc] px-4 py-8"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
    >
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl mt-0.5">🤔</span>
          <div>
            <p className="text-xs font-heading font-700 uppercase tracking-widest text-primary mb-2">
              Your Choice
            </p>
            <p className="font-body text-base text-[#0f172a] leading-relaxed">
              {scenario.prompt}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {scenario.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onChoose(option.id)}
              className="w-full text-left rounded-card border-2 border-border bg-surface p-5 font-body text-base text-[#0f172a] leading-relaxed hover:border-primary hover:bg-primary-light transition-all duration-150 active:scale-[0.98] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="font-heading font-700 text-primary mr-2">
                {option.id}.
              </span>
              {option.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted font-body text-center">
          There's no wrong answer here — both paths continue the story.
        </p>
      </div>
    </motion.div>
  )
}
