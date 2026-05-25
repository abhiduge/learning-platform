import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (requiredRole && profile?.role !== requiredRole) {
    const redirect = profile?.role === 'parent' ? '/parent' : '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return children
}
