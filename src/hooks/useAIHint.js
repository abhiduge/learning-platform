import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useAIHint({ enabled, question, wrongAnswers, concept, lessonDay }) {
  const { user } = useAuthStore()
  const [hint, setHint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled || hint) return

    let cancelled = false
    setLoading(true)
    setError(null)

    async function fetchHint() {
      let teenId = null
      let accessToken = null

      if (user && supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        teenId = user.id
        accessToken = session?.access_token ?? null
      }

      try {
        const res = await fetch('/api/hint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, wrongAnswers, concept, lessonDay, teenId, accessToken }),
        })

        const data = await res.json()

        if (!cancelled) {
          if (!res.ok) {
            setError(data.error ?? 'Could not load hint.')
          } else {
            setHint(data.hint)
          }
        }
      } catch {
        if (!cancelled) setError('Hint unavailable — check your connection.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchHint()
    return () => { cancelled = true }
  }, [enabled])

  return { hint, loading, error }
}
