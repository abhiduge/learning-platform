import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signIn } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { supabaseConfigured } from '../lib/supabase'

export function Login() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (profile) {
    navigate(profile.role === 'parent' ? '/parent' : '/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabaseConfigured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
      return
    }
    setError('')
    setLoading(true)
    const { data, error: signInError } = await signIn(email, password)
    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    // useAuthListener handles profile fetch and redirect via state
  }

  return (
    <div className="flex flex-col min-h-screen bg-story-bg px-6 py-10">
      <motion.div
        className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center">
          <div className="text-5xl mb-3">📈</div>
          <h1 className="font-heading font-800 text-3xl text-white">Welcome back</h1>
          <p className="text-story-text/70 font-body text-sm mt-1">Sign in to continue your journey</p>
        </div>

        {!supabaseConfigured && (
          <div className="bg-amber-500/20 border border-amber-500/40 rounded-card px-4 py-3 text-amber-200 text-sm font-body">
            ⚠️ Supabase not configured. Set up your .env file to enable accounts.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-story-text/80 font-heading font-700 text-sm mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-card bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 font-body text-base focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-story-text/80 font-heading font-700 text-sm mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-card bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 font-body text-base focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-danger text-sm font-body bg-red-500/10 rounded-card px-4 py-2">
              {error}
            </p>
          )}

          <Button type="submit" variant="accent" disabled={loading} className="w-full mt-2">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-story-text/60 font-body text-sm">
          No account?{' '}
          <Link to="/register" className="text-accent font-heading font-700 underline">
            Get started free
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
