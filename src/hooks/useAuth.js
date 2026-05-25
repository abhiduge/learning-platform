import { useEffect } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

async function fetchProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export function useAuthListener() {
  const { setUser, setProfile, setLoading, clear } = useAuthStore()

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const profile = await fetchProfile(session.user.id)
        setProfile(profile)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const profile = await fetchProfile(session.user.id)
          setProfile(profile)
        } else {
          clear()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  await supabase.auth.signOut()
}

function generateInviteCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function registerTeen({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error || !data.user) return { error }

  const inviteCode = generateInviteCode()

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    role: 'teen',
    display_name: displayName,
    invite_code: inviteCode,
  })

  if (profileError) return { error: profileError }

  const { error: statsError } = await supabase.from('teen_stats').insert({
    teen_id: data.user.id,
  })

  return { data, inviteCode, error: statsError || null }
}

export async function registerParent({ email, password, inviteCode }) {
  // Look up the teen by invite code first
  const { data: teenProfile, error: lookupError } = await supabase
    .from('profiles')
    .select('id')
    .eq('invite_code', inviteCode)
    .eq('role', 'teen')
    .single()

  if (lookupError || !teenProfile) {
    return { error: { message: 'Invalid invite code. Please check with your teen.' } }
  }

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error || !data.user) return { error }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    role: 'parent',
    display_name: 'Parent',
  })
  if (profileError) return { error: profileError }

  const { error: linkError } = await supabase.from('parent_child').insert({
    parent_id: data.user.id,
    teen_id: teenProfile.id,
  })

  return { data, error: linkError || null }
}
