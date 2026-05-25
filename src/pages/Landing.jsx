import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { supabaseConfigured } from '../lib/supabase'

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-story-bg px-6 py-10">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">📈</div>
          <h1 className="font-heading font-800 text-4xl text-white leading-tight">
            Invest<span className="text-accent">Quest</span>
          </h1>
          <p className="text-story-text/80 font-body text-base mt-3 leading-relaxed">
            Learn to invest in 5 minutes a day. Follow Alex's story and build real financial skills.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div className="bg-white/10 rounded-card p-5 flex items-center gap-4">
            <span className="text-2xl">📖</span>
            <div>
              <p className="font-heading font-700 text-white text-sm">Module 1 · 10 Days</p>
              <p className="font-body text-story-text/70 text-sm">Basics of Investing</p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/register')}
            variant="accent"
            className="w-full text-lg py-4"
          >
            Get Started Free →
          </Button>

          <p className="text-center text-story-text/60 font-body text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-heading font-700 underline">
              Sign in
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center gap-8 text-center"
        >
          {[['5 min', 'per day'], ['10 days', 'module 1'], ['Free', 'always']].map(
            ([value, label]) => (
              <div key={label}>
                <p className="font-heading font-800 text-accent text-lg">{value}</p>
                <p className="font-body text-story-text/60 text-xs">{label}</p>
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  )
}
