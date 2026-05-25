import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { registerTeen, registerParent } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { supabaseConfigured } from '../lib/supabase'

const STEPS = { ROLE: 'ROLE', TEEN_FORM: 'TEEN_FORM', PARENT_FORM: 'PARENT_FORM', TEEN_INVITE: 'TEEN_INVITE' }

export function Register() {
  const navigate = useNavigate()
  const { setUser, setProfile } = useAuthStore()
  const [step, setStep] = useState(STEPS.ROLE)
  const [role, setRole] = useState(null)
  const [form, setForm] = useState({ displayName: '', email: '', password: '', ageConfirmed: false, inviteCode: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviteCode, setInviteCode] = useState('')

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const chooseRole = (r) => {
    setRole(r)
    setStep(r === 'teen' ? STEPS.TEEN_FORM : STEPS.PARENT_FORM)
  }

  const handleTeenSubmit = async (e) => {
    e.preventDefault()
    if (!form.ageConfirmed) { setError('You must confirm you are 13 or older to register.'); return }
    setError('')
    setLoading(true)
    const { data, inviteCode: code, error: err } = await registerTeen({
      email: form.email,
      password: form.password,
      displayName: form.displayName,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    // Set user + profile in store immediately so ProtectedRoute doesn't
    // hit a null-profile blank screen before the auth listener catches up
    if (data?.user) {
      setUser(data.user)
      setProfile({
        id: data.user.id,
        role: 'teen',
        display_name: form.displayName,
        invite_code: code,
      })
    }
    setInviteCode(code)
    setStep(STEPS.TEEN_INVITE)
  }

  const handleParentSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await registerParent({
      email: form.email,
      password: form.password,
      inviteCode: form.inviteCode,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    navigate('/parent', { replace: true })
  }

  if (!supabaseConfigured) {
    return (
      <div className="flex flex-col min-h-screen bg-story-bg px-6 py-10 items-center justify-center">
        <div className="bg-amber-500/20 border border-amber-500/40 rounded-card px-6 py-5 text-amber-200 font-body text-sm max-w-sm text-center">
          ⚠️ Supabase not configured.<br />Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file to enable accounts.
        </div>
        <Link to="/" className="mt-6 text-story-text/60 text-sm font-body underline">← Back</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-story-bg px-6 py-10">
      <AnimatePresence mode="wait">
        {step === STEPS.ROLE && (
          <motion.div
            key="role"
            className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-8"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          >
            <div className="text-center">
              <div className="text-5xl mb-3">👋</div>
              <h1 className="font-heading font-800 text-3xl text-white">Who are you?</h1>
              <p className="text-story-text/70 font-body text-sm mt-1">We'll set up the right experience for you</p>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => chooseRole('teen')}
                className="w-full rounded-card bg-white/10 border-2 border-white/20 hover:border-primary hover:bg-primary/20 text-white p-6 text-left transition-all"
              >
                <p className="text-3xl mb-2">🎒</p>
                <p className="font-heading font-800 text-lg">I'm a teen</p>
                <p className="font-body text-sm text-story-text/70 mt-1">Start learning to invest</p>
              </button>
              <button
                onClick={() => chooseRole('parent')}
                className="w-full rounded-card bg-white/10 border-2 border-white/20 hover:border-primary hover:bg-primary/20 text-white p-6 text-left transition-all"
              >
                <p className="text-3xl mb-2">👨‍👩‍👧</p>
                <p className="font-heading font-800 text-lg">I'm a parent</p>
                <p className="font-body text-sm text-story-text/70 mt-1">Track my teen's progress</p>
              </button>
            </div>
            <p className="text-center text-story-text/60 font-body text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-heading font-700 underline">Sign in</Link>
            </p>
          </motion.div>
        )}

        {step === STEPS.TEEN_FORM && (
          <motion.div
            key="teen"
            className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-6"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          >
            <div>
              <button onClick={() => setStep(STEPS.ROLE)} className="text-story-text/60 font-body text-sm mb-4">← Back</button>
              <h1 className="font-heading font-800 text-2xl text-white">Create your account</h1>
              <p className="text-story-text/70 font-body text-sm mt-1">Join Alex on the investing journey</p>
            </div>
            <form onSubmit={handleTeenSubmit} className="flex flex-col gap-4">
              {[
                { label: 'Your name', field: 'displayName', type: 'text', placeholder: 'Alex' },
                { label: 'Email', field: 'email', type: 'email', placeholder: 'alex@example.com' },
                { label: 'Password', field: 'password', type: 'password', placeholder: '8+ characters' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-story-text/80 font-heading font-700 text-sm mb-1.5">{label}</label>
                  <input
                    type={type}
                    required
                    minLength={type === 'password' ? 8 : undefined}
                    value={form[field]}
                    onChange={set(field)}
                    placeholder={placeholder}
                    className="w-full rounded-card bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 font-body text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
              <label className="flex items-start gap-3 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={form.ageConfirmed}
                  onChange={set('ageConfirmed')}
                  className="mt-0.5 w-5 h-5 rounded accent-primary flex-shrink-0"
                />
                <span className="text-story-text/80 font-body text-sm">
                  I confirm I am 13 years old or older
                </span>
              </label>
              {error && <p className="text-danger text-sm font-body bg-red-500/10 rounded-card px-4 py-2">{error}</p>}
              <Button type="submit" variant="accent" disabled={loading} className="w-full mt-2">
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>
          </motion.div>
        )}

        {step === STEPS.TEEN_INVITE && (
          <motion.div
            key="invite"
            className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-8 text-center"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl">🎉</div>
            <div>
              <h1 className="font-heading font-800 text-2xl text-white">Account created!</h1>
              <p className="text-story-text/70 font-body text-sm mt-2">Share this code with your parent so they can link to your account and see your progress.</p>
            </div>
            <div className="bg-white/10 rounded-card px-8 py-6">
              <p className="text-story-text/60 font-body text-xs uppercase tracking-widest mb-2">Your invite code</p>
              <p className="font-mono text-accent text-5xl font-700 tracking-[0.25em]">{inviteCode}</p>
            </div>
            <Button onClick={() => navigate('/dashboard', { replace: true })} variant="accent" className="w-full">
              Start Learning →
            </Button>
          </motion.div>
        )}

        {step === STEPS.PARENT_FORM && (
          <motion.div
            key="parent"
            className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-6"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          >
            <div>
              <button onClick={() => setStep(STEPS.ROLE)} className="text-story-text/60 font-body text-sm mb-4">← Back</button>
              <h1 className="font-heading font-800 text-2xl text-white">Parent account</h1>
              <p className="text-story-text/70 font-body text-sm mt-1">Enter your teen's invite code to link accounts</p>
            </div>
            <form onSubmit={handleParentSubmit} className="flex flex-col gap-4">
              {[
                { label: 'Email', field: 'email', type: 'email', placeholder: 'you@example.com' },
                { label: 'Password', field: 'password', type: 'password', placeholder: '8+ characters' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-story-text/80 font-heading font-700 text-sm mb-1.5">{label}</label>
                  <input
                    type={type}
                    required
                    minLength={type === 'password' ? 8 : undefined}
                    value={form[field]}
                    onChange={set(field)}
                    placeholder={placeholder}
                    className="w-full rounded-card bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 font-body text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
              <div>
                <label className="block text-story-text/80 font-heading font-700 text-sm mb-1.5">Teen's invite code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={form.inviteCode}
                  onChange={set('inviteCode')}
                  placeholder="6-digit code"
                  className="w-full rounded-card bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 font-mono text-2xl tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {error && <p className="text-danger text-sm font-body bg-red-500/10 rounded-card px-4 py-2">{error}</p>}
              <Button type="submit" variant="accent" disabled={loading} className="w-full mt-2">
                {loading ? 'Linking accounts…' : 'Link & Create Account'}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
