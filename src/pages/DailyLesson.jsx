import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLesson, STEPS } from '../hooks/useLesson'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { saveProgress } from '../hooks/useProgress'
import { calcXpEarned } from '../lib/xpSystem'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StoryIntro } from '../components/lesson/StoryIntro'
import { ConceptCard } from '../components/lesson/ConceptCard'
import { ScenarioChoice } from '../components/lesson/ScenarioChoice'
import { QuizQuestion } from '../components/lesson/QuizQuestion'
import { XPReward } from '../components/lesson/XPReward'
import day1 from '../content/module1/days/day1'
import day2 from '../content/module1/days/day2'
import day3 from '../content/module1/days/day3'
import day4 from '../content/module1/days/day4'
import day5 from '../content/module1/days/day5'
import day6 from '../content/module1/days/day6'
import day7 from '../content/module1/days/day7'
import day8 from '../content/module1/days/day8'
import day9 from '../content/module1/days/day9'
import day10 from '../content/module1/days/day10'

const DAY_CONTENT = { 1: day1, 2: day2, 3: day3, 4: day4, 5: day5, 6: day6, 7: day7, 8: day8, 9: day9, 10: day10 }

export function DailyLesson() {
  const { dayNumber } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { progress, stats, badges, addProgress, addBadges, setStats } = useProgressStore()
  const [newBadgeIds, setNewBadgeIds] = useState([])
  const saveCalledRef = useRef(false)

  const lessonData = DAY_CONTENT[Number(dayNumber)]

  const {
    step,
    quizIndex,
    score,
    xpEarned,
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
    scenarioChoice,
  } = useLesson(lessonData)

  // Save progress as soon as the REWARD step is entered, so badges appear on screen
  useEffect(() => {
    if (step !== STEPS.REWARD || saveCalledRef.current || !lessonData) return
    saveCalledRef.current = true

    const isFirstLesson = lessonData.moduleId === 'module1' && lessonData.dayNumber === 1
    const earnedXp = calcXpEarned({ quizScore: score, isFirstLesson })

    const record = {
      moduleId: lessonData.moduleId,
      dayNumber: lessonData.dayNumber,
      score,
      xpEarned: earnedXp,
      scenarioChoice,
      completedAt: new Date().toISOString(),
    }

    saveProgress({
      teenId: user?.id,
      record,
      currentStats: stats,
      currentProgress: progress,
      currentBadgeIds: badges,
    }).then(({ newBadgeIds: awarded = [], updatedStats }) => {
      addProgress({
        module_id: record.moduleId,
        day_number: record.dayNumber,
        quiz_score: record.score,
        xp_earned: record.xpEarned,
      })
      if (awarded.length > 0) addBadges(awarded)
      if (updatedStats) setStats(updatedStats)
      setNewBadgeIds(awarded)
    })
  }, [step])

  if (!lessonData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-body text-muted">Day {dayNumber} not found.</p>
      </div>
    )
  }

  if (step === STEPS.IDLE) {
    startLesson()
    return null
  }

  if (step === STEPS.COMPLETE) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const prevXp = stats?.total_xp ?? 0

  return (
    <div className="flex flex-col min-h-screen">
      {step !== STEPS.STORY && step !== STEPS.REWARD && (
        <ProgressBar currentStep={step} />
      )}

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === STEPS.STORY && (
            <StoryIntro key="story" story={lessonData.story} onContinue={advanceFromStory} />
          )}
          {step === STEPS.CONCEPT && (
            <ConceptCard key="concept" concept={lessonData.concept} onContinue={advanceFromConcept} />
          )}
          {step === STEPS.SCENARIO && (
            <ScenarioChoice key="scenario" scenario={lessonData.scenario} onChoose={chooseScenario} />
          )}
          {step === STEPS.QUIZ && currentQuizQuestion && (
            <QuizQuestion
              key={`quiz-${quizIndex}`}
              question={currentQuizQuestion}
              questionNumber={quizIndex + 1}
              attempts={currentQuizAttempts}
              isSolved={currentQuizSolved}
              lastAnswerCorrect={lastAnswerCorrect}
              onSubmit={submitAnswer}
              onAdvance={advanceQuiz}
              concept={lessonData.concept.heading}
              lessonDay={lessonData.dayNumber}
            />
          )}
          {step === STEPS.REWARD && (
            <XPReward
              key="reward"
              xpEarned={xpEarned}
              score={score}
              newBadgeIds={newBadgeIds}
              prevXp={prevXp}
              onComplete={() => completeLesson()}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
