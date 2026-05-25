import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { useAuthListener } from './hooks/useAuth'
import { useAuthStore } from './store/authStore'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { TeenDashboard } from './pages/TeenDashboard'
import { ModuleMap } from './pages/ModuleMap'
import { DailyLesson } from './pages/DailyLesson'
import { ParentDashboard } from './pages/ParentDashboard'
import { NotFound } from './pages/NotFound'

function AuthRedirect() {
  const { user, profile, loading } = useAuthStore()
  if (loading) return null
  if (user && profile) {
    return <Navigate to={profile.role === 'parent' ? '/parent' : '/dashboard'} replace />
  }
  return <Landing />
}

export default function App() {
  useAuthListener()

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="teen">
              <TeenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/module-map"
          element={
            <ProtectedRoute requiredRole="teen">
              <ModuleMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:dayNumber"
          element={
            <ProtectedRoute requiredRole="teen">
              <DailyLesson />
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent"
          element={
            <ProtectedRoute requiredRole="parent">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  )
}
