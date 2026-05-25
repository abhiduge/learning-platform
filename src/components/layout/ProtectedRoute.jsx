import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuthStore()

  const spinner = (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Still initialising auth
  if (loading) return spinner

  // Not logged in
  if (!user) return <Navigate to="/login" replace />

  // Logged in but profile not fetched yet (race condition on signup) — wait
  if (!profile) return spinner

  if (requiredRole && profile.role !== requiredRole) {
    const redirect = profile.role === 'parent' ? '/parent' : '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return children
}
