import { useEffect } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { useProgressStore } from '../store/progressStore'
import { useAuthStore } from '../store/authStore'
import { getLevelForXp, calcXpEarned } from '../lib/xpSystem'
import { checkNewBadges } from '../lib/badges'

export function useProgressLoader() {
  const { user } = useAuthStore()
  const { setProgress, setStats, setBadges, setLoading } = useProgressStore()

  useEffect(() => {
    if (!supabaseConfigured || !user) return

    setLoading(true)
    Promise.all([
      supabase.from('progress').select('*').eq('teen_id', user.id),
      supabase.from('teen_stats').select('*').eq('teen_id', user.id).single(),
      supabase.from('badges').select('badge_id').eq('teen_id', user.id),
    ]).then(([{ data: prog }, { data: stats }, { data: bdg }]) => {
      setProgress(prog || [])
      setStats(stats || null)
      setBadges((bdg || []).map((b) => b.badge_id))
      setLoading(false)
    })
  }, [user?.id])
}

function calcStreak(currentStats) {
  const today = new Date().toISOString().slice(0, 10)
  if (!currentStats || !currentStats.last_active_date) {
    return { current_streak: 1, longest_streak: 1, last_active_date: today }
  }

  const last = currentStats.last_active_date
  if (last === today) {
    // Same day replay — no streak change
    return {
      current_streak: currentStats.current_streak,
      longest_streak: currentStats.longest_streak,
      last_active_date: today,
    }
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const isConsecutive = last === yesterday.toISOString().slice(0, 10)

  const gapDays = Math.round(
    (new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24)
  )

  const newStreak = isConsecutive ? currentStats.current_streak + 1 : 1
  const newLongest = Math.max(newStreak, currentStats.longest_streak || 1)

  return {
    current_streak: newStreak,
    longest_streak: newLongest,
    last_active_date: today,
    gap_days: gapDays,
  }
}

export async function saveProgress({ teenId, record, currentStats, currentProgress, currentBadgeIds }) {
  if (!supabaseConfigured || !teenId) return { newBadgeIds: [] }

  const streakData = calcStreak(currentStats)
  const newXp = (currentStats?.total_xp || 0) + record.xp_earned
  const newLevel = getLevelForXp(newXp).level

  // Upsert progress row
  await supabase.from('progress').upsert({
    teen_id: teenId,
    module_id: record.moduleId,
    day_number: record.dayNumber,
    quiz_score: record.score,
    xp_earned: record.xpEarned,
    scenario_choice: record.scenarioChoice,
    completed_at: record.completedAt,
  }, { onConflict: 'teen_id,module_id,day_number' })

  // Update stats
  const updatedStats = {
    teen_id: teenId,
    total_xp: newXp,
    level: newLevel,
    current_streak: streakData.current_streak,
    longest_streak: streakData.longest_streak,
    last_active_date: streakData.last_active_date,
    updated_at: new Date().toISOString(),
  }
  await supabase.from('teen_stats').upsert(updatedStats, { onConflict: 'teen_id' })

  // Check for new badges
  const allProgress = [
    ...currentProgress.filter(
      (p) => !(p.module_id === record.moduleId && p.day_number === record.dayNumber)
    ),
    { module_id: record.moduleId, day_number: record.dayNumber },
  ]

  const newBadgeIds = checkNewBadges({
    progress: allProgress,
    stats: updatedStats,
    existingBadgeIds: currentBadgeIds,
    quizScore: record.score,
    gapDays: streakData.gap_days,
  })

  if (newBadgeIds.length > 0) {
    await supabase.from('badges').insert(
      newBadgeIds.map((badge_id) => ({ teen_id: teenId, badge_id }))
    )
  }

  return { newBadgeIds, updatedStats }
}
