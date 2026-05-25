import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { QuizHint } from './QuizHint'
import { useAIHint } from '../../hooks/useAIHint'

const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, -6, 6, 0],
    transition: { duration: 0.4 },
  },
}

export function QuizQuestion({
  question,
  questionNumber,
  attempts,
  isSolved,
  lastAnswerCorrect,
  onSubmit,
  onAdvance,
  concept,
  lessonDay,
}) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState([])

  // Fetch AI hint on the 2nd wrong attempt
  const hintEnabled = attempts === 2 && !isSolved
  const { hint, loading: hintLoading, error: hintError } = useAIHint({
    enabled: hintEnabled,
    question: question.question,
    wrongAnswers,
    concept: concept ?? '',
    lessonDay: lessonDay ?? 1,
  })

  const handleSubmit = () => {
    if (selected === null) return
    const isCorrect = selected === question.correctIndex
    if (!isCorrect) {
      setWrongAnswers((prev) => [...prev, question.options[selected]])
    }
    setSubmitted(true)
    onSubmit(selected)
  }

  const handleAdvance = () => {
    setSelected(null)
    setSubmitted(false)
    onAdvance()
  }

  const showRevealedAnswer = attempts >= 3 && !isSolved

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-[#f8fafc] px-4 py-8"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
      aria-live="polite"
    >
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-5">
        <div>
          <p
            className="text-xs font-heading font-700 uppercase tracking-widest text-primary mb-2"
            aria-label={`Question ${questionNumber} of 3`}
          >
            Question {questionNumber} of 3
          </p>
          <h2 id="quiz-question" className="font-heading font-700 text-xl text-[#0f172a] leading-snug">
            {question.question}
          </h2>
        </div>

        <div
          className="flex flex-col gap-3"
          role="radiogroup"
          aria-labelledby="quiz-question"
        >
          {question.options.map((option, index) => {
            const isSelected = selected === index
            const isRevealed = showRevealedAnswer && index === question.correctIndex

            let style =
              'border-2 border-border bg-surface text-[#0f172a] hover:border-primary hover:bg-primary-light'

            if (submitted && isSelected && lastAnswerCorrect) {
              style = 'border-2 border-success bg-green-50 text-success'
            } else if (submitted && isSelected && !lastAnswerCorrect) {
              style = 'border-2 border-danger bg-red-50 text-danger'
            } else if (isRevealed) {
              style = 'border-2 border-success bg-green-50 text-success'
            } else if (isSelected && !submitted) {
              style = 'border-2 border-primary bg-primary-light text-primary'
            }

            const isShaking = submitted && isSelected && !lastAnswerCorrect
            const Wrapper = isShaking ? motion.button : 'button'
            const motionProps = isShaking ? { variants: shakeVariants, animate: 'shake' } : {}

            return (
              <Wrapper
                key={index}
                role="radio"
                aria-checked={isSelected}
                aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                onClick={() => {
                  if (!submitted && !isSolved) setSelected(index)
                }}
                disabled={submitted || isSolved}
                className={`w-full text-left rounded-card p-4 font-body text-base leading-relaxed transition-all duration-150 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${style} disabled:cursor-default`}
                {...motionProps}
              >
                <span className="font-heading font-700 mr-2 text-sm opacity-60" aria-hidden="true">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {submitted && isSelected && lastAnswerCorrect && (
                  <span className="ml-2" aria-hidden="true">✓</span>
                )}
                {isRevealed && <span className="ml-2" aria-hidden="true">✓</span>}
              </Wrapper>
            )
          })}
        </div>

        {/* AI Hint — shown on 2nd wrong attempt */}
        <AnimatePresence>
          {(hintEnabled || hint || hintLoading || hintError) && (
            <QuizHint hint={hint} loading={hintLoading} error={hintError} />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {submitted && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className={`rounded-card px-4 py-3 text-sm font-body ${
                lastAnswerCorrect
                  ? 'bg-green-50 text-success border border-success'
                  : 'bg-red-50 text-danger border border-danger'
              }`}
            >
              {lastAnswerCorrect ? (
                <span>✓ Correct! {question.explanation}</span>
              ) : attempts >= 3 ? (
                <span>The correct answer is shown above. {question.explanation}</span>
              ) : (
                <span>Not quite — try again!</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-md mx-auto w-full pt-4">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={selected === null}
            className="w-full"
            aria-label="Check your answer"
          >
            Check Answer
          </Button>
        ) : (
          <Button
            onClick={handleAdvance}
            className="w-full"
            aria-label={lastAnswerCorrect || attempts >= 3 ? 'Next question' : 'Try again'}
          >
            {lastAnswerCorrect || attempts >= 3 ? 'Next →' : 'Try Again →'}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
