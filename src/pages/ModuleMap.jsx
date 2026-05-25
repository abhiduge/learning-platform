import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProgressStore } from '../store/progressStore'
import { useProgressLoader } from '../hooks/useProgress'
import { NavBar } from '../components/layout/NavBar'
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

const ALL_DAYS = [day1, day2, day3, day4, day5, day6, day7, day8, day9, day10]

export function ModuleMap() {
  useProgressLoader()
  const navigate = useNavigate()
  const { progress } = useProgressStore()

  const completedDayNumbers = progress
    .filter((p) => p.module_id === 'module1')
    .map((p) => p.day_number)

  const getDayState = (dayNumber) => {
    if (completedDayNumbers.includes(dayNumber)) return 'complete'
    if (dayNumber === 1 || completedDayNumbers.includes(dayNumber - 1)) return 'unlocked'
    return 'locked'
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] pb-24">
      <div className="bg-story-bg px-5 pt-8 pb-6">
        <h1 className="font-heading font-800 text-2xl text-white">Module 1</h1>
        <p className="text-story-text/70 font-body text-sm mt-1">Basics of Investing · 10 days</p>
      </div>

      <div className="px-4 py-5 flex flex-col gap-3">
        {ALL_DAYS.map((day, i) => {
          const state = getDayState(day.dayNumber)
          const isLocked = state === 'locked'
          const isComplete = state === 'complete'

          return (
            <motion.button
              key={day.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={() => !isLocked && navigate(`/lesson/${day.dayNumber}`)}
              disabled={isLocked}
              className={`w-full flex items-center gap-4 rounded-card p-4 text-left transition-all shadow-card ${
                isLocked
                  ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                  : isComplete
                  ? 'bg-green-50 border-2 border-success'
                  : 'bg-surface border-2 border-primary hover:bg-primary-light'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-heading font-800 shrink-0 ${
                  isComplete ? 'bg-success text-white' : isLocked ? 'bg-gray-300 text-gray-500' : 'bg-primary text-white'
                }`}
              >
                {isComplete ? '✓' : isLocked ? '🔒' : day.dayNumber}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-heading font-700 text-sm ${isLocked ? 'text-muted' : 'text-[#0f172a]'}`}>
                  Day {day.dayNumber}
                </p>
                <p className={`font-body text-sm truncate mt-0.5 ${isLocked ? 'text-gray-400' : 'text-muted'}`}>
                  {day.title}
                </p>
              </div>
              {isComplete && (
                <span className="text-xs font-heading font-700 text-success shrink-0">Done</span>
              )}
              {!isLocked && !isComplete && (
                <span className="text-primary text-lg shrink-0">→</span>
              )}
            </motion.button>
          )
        })}
      </div>

      <NavBar />
    </div>
  )
}
