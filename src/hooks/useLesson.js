import { useState, useCallback } from 'react'
import { calcXpEarned } from '../lib/xpSystem'

export const STEPS = {
  IDLE: 'IDLE',
  STORY: 'STORY',
  CONCEPT: 'CONCEPT',
  SCENARIO: 'SCENARIO',
  QUIZ: 'QUIZ',
  REWARD: 'REWARD',
  COMPLETE: 'COMPLETE',
}

const TOTAL_QUIZ_QUESTIONS = 3

function buildInitialQuizState(questions) {
  return questions.map(() => ({
    attempts: 0,
    solved: false,
    firstAttemptCorrect: false,
  }))
}

export function useLesson(lessonData) {
  const [step, setStep] = useState(STEPS.IDLE)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizState, setQuizState] = useState(() =>
    buildInitialQuizState(lessonData.quiz)
  )
  const [scenarioChoice, setScenarioChoice] = useState(null)
  const [xpEarned, setXpEarned] = useState(0)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null)

  const score = quizState.filter((q) => q.firstAttemptCorrect).length

  const startLesson = useCallback(() => setStep(STEPS.STORY), [])

  const advanceFromStory = useCallback(() => setStep(STEPS.CONCEPT), [])

  const advanceFromConcept = useCallback(() => setStep(STEPS.SCENARIO), [])

  const chooseScenario = useCallback((optionId) => {
    setScenarioChoice(optionId)
    setStep(STEPS.QUIZ)
  }, [])

  const submitAnswer = useCallback(
    (selectedIndex) => {
      const question = lessonData.quiz[quizIndex]
      const isCorrect = selectedIndex === question.correctIndex

      setLastAnswerCorrect(isCorrect)

      setQuizState((prev) => {
        const updated = [...prev]
        const current = { ...updated[quizIndex] }
        current.attempts += 1
        if (isCorrect) {
          current.solved = true
          if (current.attempts === 1) current.firstAttemptCorrect = true
        }
        updated[quizIndex] = current
        return updated
      })
    },
    [quizIndex, lessonData.quiz]
  )

  const advanceQuiz = useCallback(() => {
    setLastAnswerCorrect(null)
    const nextIndex = quizIndex + 1
    if (nextIndex >= TOTAL_QUIZ_QUESTIONS) {
      const isFirstLesson =
        lessonData.moduleId === 'module1' && lessonData.dayNumber === 1
      const earned = calcXpEarned({ quizScore: score, isFirstLesson })
      setXpEarned(earned)
      setStep(STEPS.REWARD)
    } else {
      setQuizIndex(nextIndex)
    }
  }, [quizIndex, score, lessonData])

  const completeLesson = useCallback(() => {
    setStep(STEPS.COMPLETE)
  }, [])

  const currentQuizQuestion = lessonData.quiz[quizIndex]
  const currentQuizAttempts = quizState[quizIndex]?.attempts ?? 0
  const currentQuizSolved = quizState[quizIndex]?.solved ?? false

  return {
    step,
    quizIndex,
    score,
    xpEarned,
    scenarioChoice,
    lastAnswerCorrect,
    currentQuizQuestion,
    currentQuizAttempts,
    currentQuizSolved,
    startLesson,
    advanceFromStory,
    advanceFromConcept,
    chooseScenario,
    submitAnswer,
    advanceQuiz,
    completeLesson,
  }
}
