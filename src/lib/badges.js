export const BADGE_DEFS = [
  {
    id: 'first_lesson',
    name: 'First Step',
    description: 'Complete Day 1',
    emoji: '🌱',
  },
  {
    id: 'perfect_quiz',
    name: 'Quiz Ace',
    description: 'Score 3/3 on any quiz',
    emoji: '⭐',
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7-day streak',
    emoji: '🔥',
  },
  {
    id: 'streak_14',
    name: 'Fortnight Fighter',
    description: '14-day streak',
    emoji: '💎',
  },
  {
    id: 'module1_complete',
    name: 'Investing Initiate',
    description: 'Complete all 10 days',
    emoji: '🏆',
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Return after 3+ days away',
    emoji: '🦅',
  },
]

export function checkNewBadges({ progress, stats, existingBadgeIds, quizScore }) {
  const earned = new Set(existingBadgeIds)
  const newBadges = []

  const maybeAward = (id) => {
    if (!earned.has(id)) {
      newBadges.push(id)
      earned.add(id)
    }
  }

  // first_lesson: completed day 1
  if (progress.some((p) => p.module_id === 'module1' && p.day_number === 1)) {
    maybeAward('first_lesson')
  }

  // perfect_quiz: score 3/3 on the just-completed lesson
  if (quizScore === 3) {
    maybeAward('perfect_quiz')
  }

  // streak milestones
  if (stats.current_streak >= 7) maybeAward('streak_7')
  if (stats.current_streak >= 14) maybeAward('streak_14')

  // module1_complete: all 10 days done
  const m1Days = progress.filter((p) => p.module_id === 'module1').map((p) => p.day_number)
  const allTen = [1,2,3,4,5,6,7,8,9,10].every((d) => m1Days.includes(d))
  if (allTen) maybeAward('module1_complete')

  return newBadges
}
