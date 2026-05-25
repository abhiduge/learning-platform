import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useProgressLoader } from '../hooks/useProgress'
import { signOut } from '../hooks/useAuth'
import { NavBar } from '../components/layout/NavBar'
import { StreakDisplay } from '../components/dashboard/StreakDisplay'
import { ModuleProgress } from '../components/dashboard/ModuleProgress'
import { BadgeCollection } from '../components/dashboard/BadgeCollection'
import { Button } from '../components/ui/Button'

export function TeenDashboard() {
  useProgressLoader()
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const { progress, stats, badges } = useProgressStore()

  const completedDays = progress.filter((p) => p.module_id === 'module1').length
  const nextDay = Math.min(completedDays + 1, 10)
  const allDone = completedDays >= 10

  const totalXp = stats?.total_xp ?? 0
  const streak = stats?.current_streak ?? 0

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-story-bg px-5 pt-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-story-text/60 font-body text-sm">Welcome back,</p>
            <h1 className="font-heading font-800 text-2xl text-white">
              {profile?.display_name ?? 'Alex'} 👋
            </h1>
          </div>
          <button
            onClick={handleSignOut}
            className="text-story-text/40 font-body text-xs underline"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="px-4 -mt-6 flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StreakDisplay streak={streak} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ModuleProgress totalXp={totalXp} completedDays={completedDays} />
        </motion.div>

        {/* Today's lesson CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-surface rounded-card shadow-card p-5"
        >
          <p className="text-xs font-heading font-700 uppercase tracking-widest text-primary mb-2">
            {allDone ? 'Module Complete!' : "Today's Lesson"}
          </p>
          {allDone ? (
            <div>
              <p className="font-heading font-800 text-lg text-[#0f172a] mb-1">🏆 You finished Module 1!</p>
              <p className="font-body text-sm text-muted">Module 2 coming soon.</p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-heading font-700 text-base text-[#0f172a]">
                  Day {nextDay}
                </p>
                <p className="font-body text-sm text-muted mt-0.5">Module 1 · Basics of Investing</p>
              </div>
              <Button onClick={() => navigate(`/lesson/${nextDay}`)} className="shrink-0">
                Play →
              </Button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <BadgeCollection earnedBadgeIds={badges} />
        </motion.div>
      </div>

      <NavBar />
    </div>
  )
}
