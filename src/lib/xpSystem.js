export const XP_VALUES = {
  COMPLETE_LESSON: 30,
  PERFECT_QUIZ: 20,
  GOOD_QUIZ: 10,
  FIRST_LESSON: 25,
  STREAK_7: 50,
  MODULE_COMPLETE: 100,
}

export const LEVELS = [
  { level: 1, name: 'Curious Saver', minXp: 0 },
  { level: 2, name: 'Budget Builder', minXp: 150 },
  { level: 3, name: 'Smart Spender', minXp: 350 },
  { level: 4, name: 'Investment Rookie', minXp: 650 },
  { level: 5, name: 'Market Explorer', minXp: 1000 },
]

export function calcXpEarned({ quizScore, isFirstLesson = false }) {
  let xp = XP_VALUES.COMPLETE_LESSON
  if (quizScore === 3) xp += XP_VALUES.PERFECT_QUIZ
  else if (quizScore === 2) xp += XP_VALUES.GOOD_QUIZ
  if (isFirstLesson) xp += XP_VALUES.FIRST_LESSON
  return xp
}

export function getLevelForXp(totalXp) {
  let current = LEVELS[0]
  for (const lvl of LEVELS) {
    if (totalXp >= lvl.minXp) current = lvl
  }
  return current
}

export function getXpToNextLevel(totalXp) {
  const nextLevel = LEVELS.find((lvl) => lvl.minXp > totalXp)
  if (!nextLevel) return null
  return nextLevel.minXp - totalXp
}
