import { motion } from 'framer-motion'

const STEP_LABELS = ['Story', 'Concept', 'Scenario', 'Quiz 1', 'Quiz 2', 'Quiz 3', 'Reward']

export function ProgressBar({ currentStep }) {
  const stepIndex = {
    STORY: 0,
    CONCEPT: 1,
    SCENARIO: 2,
    QUIZ: 3,
    REWARD: 6,
    COMPLETE: 7,
  }

  const active = stepIndex[currentStep] ?? 0
  const total = STEP_LABELS.length

  const pct = Math.round(((active + 1) / total) * 100)

  return (
    <div className="w-full px-4 pt-4 pb-2">
      <div
        className="flex gap-1"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Lesson progress: step ${Math.min(active + 1, total)} of ${total}`}
      >
        {STEP_LABELS.map((label, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden"
            title={label}
          >
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: i <= active ? '100%' : '0%' }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted font-body mt-1 text-right" aria-hidden="true">
        {Math.min(active + 1, total)} / {total}
      </p>
    </div>
  )
}
