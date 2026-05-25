import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

export function StoryIntro({ story, onContinue }) {
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-story-bg px-4 py-8"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
    >
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-4xl shadow-card-lg">
            👤
          </div>
          <p className="text-story-text font-heading font-700 text-lg">Alex</p>
        </div>

        <div className="flex flex-col gap-4">
          {story.paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-story-text font-body text-base leading-relaxed"
            >
              {para}
            </p>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto w-full pt-4">
        <Button onClick={onContinue} className="w-full">
          Continue →
        </Button>
      </div>
    </motion.div>
  )
}
