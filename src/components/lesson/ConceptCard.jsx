import { motion } from 'framer-motion'
import { Card } from '../ui/Card'
import { Tooltip } from '../ui/Tooltip'
import { Button } from '../ui/Button'

export function ConceptCard({ concept, onContinue }) {
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-[#f8fafc] px-4 py-8"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
    >
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💡</span>
          <h2 className="font-heading font-800 text-2xl text-[#0f172a]">
            {concept.heading}
          </h2>
        </div>

        <Card className="leading-relaxed">
          <p className="font-body text-base text-[#0f172a]">{concept.body}</p>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted font-body mb-2">Jargon buster:</p>
            <Tooltip
              term={concept.jargonTerm}
              definition={concept.jargonDefinition}
            />
          </div>
        </Card>
      </div>

      <div className="max-w-md mx-auto w-full pt-4">
        <Button onClick={onContinue} className="w-full">
          Got it →
        </Button>
      </div>
    </motion.div>
  )
}
