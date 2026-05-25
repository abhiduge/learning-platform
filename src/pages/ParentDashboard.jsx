import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { signOut } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { BADGE_DEFS } from '../lib/badges'
import { ProgressReport } from '../components/parent/ProgressReport'
import { MilestoneNotice } from '../components/parent/MilestoneNotice'
import { Button } from '../components/ui/Button'

const LAST_SEEN_KEY = (teenId) => `iq_parent_last_seen_${teenId}`

export function ParentDashboard() {
  const { user, profile } = useAuthStore()
  const navigate = useNavigate()
  const [teen, setTeen] = useState(null)         // { id, display_name }
  const [teenStats, setTeenStats] = useState(null)
  const [teenProgress, setTeenProgress] = useState([])
  const [teenBadges, setTeenBadges] = useState([])
  const [newBadgeIds, setNewBadgeIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [emailStatus, setEmailStatus] = useState(null) // 'sending' | 'sent' | 'error'

  useEffect(() => {
    if (!user || !supabase) return

    async function load() {
      // Find linked teen
      const { data: link } = await supabase
        .from('parent_child')
        .select('teen_id')
        .eq('parent_id', user.id)
        .single()

      if (!link) { setLoading(false); return }

      const teenId = link.teen_id

      const [{ data: teenProfile }, { data: stats }, { data: progress }, { data: badges }] =
        await Promise.all([
          supabase.from('profiles').select('id, display_name').eq('id', teenId).single(),
          supabase.from('teen_stats').select('*').eq('teen_id', teenId).single(),
          supabase.from('progress').select('*').eq('teen_id', teenId),
          supabase.from('badges').select('badge_id, earned_at').eq('teen_id', teenId),
        ])

      setTeen(teenProfile)
      setTeenStats(stats)
      setTeenProgress(progress ?? [])

      const badgeIds = (badges ?? []).map((b) => b.badge_id)
      setTeenBadges(badgeIds)

      // Check for new badges since last visit
      const lastSeenStr = localStorage.getItem(LAST_SEEN_KEY(teenId))
      const lastSeen = lastSeenStr ? new Date(lastSeenStr) : null
      if (lastSeen && badges) {
        const fresh = badges
          .filter((b) => new Date(b.earned_at) > lastSeen)
          .map((b) => b.badge_id)
        setNewBadgeIds(fresh)
      }

      // Record this visit
      localStorage.setItem(LAST_SEEN_KEY(teenId), new Date().toISOString())
      setLoading(false)
    }

    load()
  }, [user?.id])

  const handleSendEmail = async () => {
    if (!teen || !user) return
    setEmailStatus('sending')

    const badgeNames = teenBadges.map((id) => BADGE_DEFS.find((b) => b.id === id)?.name).filter(Boolean)

    try {
      const res = await fetch('/api/send-parent-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: user.email,
          teenName: teen.display_name,
          stats: teenStats,
          completedDays: teenProgress.filter((p) => p.module_id === 'module1').length,
          badgeNames,
        }),
      })
      setEmailStatus(res.ok ? 'sent' : 'error')
    } catch {
      setEmailStatus('error')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    )
  }

  const completedDays = teenProgress.filter((p) => p.module_id === 'module1').length

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <div className="bg-story-bg px-5 pt-8 pb-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-story-text/60 font-body text-sm">Parent view</p>
            <h1 className="font-heading font-800 text-2xl text-white">Dashboard</h1>
          </div>
          <button onClick={handleSignOut} className="text-story-text/40 font-body text-xs underline">
            Sign out
          </button>
        </div>
      </div>

      <div className="px-4 -mt-6 flex flex-col gap-4 pb-10">
        {!teen ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-card shadow-card p-6 text-center"
          >
            <div className="text-4xl mb-3">🔗</div>
            <h2 className="font-heading font-800 text-lg text-[#0f172a]">No teen linked yet</h2>
            <p className="font-body text-sm text-muted mt-2">
              Ask your teen to share their 6-digit invite code, then enter it during registration.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <MilestoneNotice newBadgeIds={newBadgeIds} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <ProgressReport
                teenName={teen.display_name}
                stats={teenStats}
                completedDays={completedDays}
                badges={teenBadges}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-card shadow-card p-5"
            >
              <h3 className="font-heading font-700 text-base text-[#0f172a] mb-1">Progress email</h3>
              <p className="font-body text-sm text-muted mb-4">
                Send a summary of {teen.display_name}'s progress to your inbox ({user.email}).
              </p>
              <Button
                onClick={handleSendEmail}
                disabled={emailStatus === 'sending' || emailStatus === 'sent'}
                variant={emailStatus === 'sent' ? 'ghost' : 'primary'}
                className="w-full"
              >
                {emailStatus === 'sending' && 'Sending…'}
                {emailStatus === 'sent' && '✓ Email sent!'}
                {emailStatus === 'error' && 'Retry — something went wrong'}
                {!emailStatus && 'Send Progress Email'}
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
