import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { OverviewPage } from '@/pages/OverviewPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected dashboard routes */}
      <Route
        path="/overview"
        element={
          <ProtectedRoute>
            <DashboardLayout pageTitle="Overview">
              <OverviewPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/equipment"
        element={
          <ProtectedRoute>
            <DashboardLayout pageTitle="Equipment">
              <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Equipment — coming soon
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/growth"
        element={
          <ProtectedRoute>
            <DashboardLayout pageTitle="Growth">
              <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Growth — coming soon
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <DashboardLayout pageTitle="Services">
              <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Services — coming soon
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/requisitions"
        element={
          <ProtectedRoute>
            <DashboardLayout pageTitle="Requisitions">
              <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Requisitions — coming soon
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/minutes"
        element={
          <ProtectedRoute>
            <DashboardLayout pageTitle="Minutes">
              <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Minutes — coming soon
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout pageTitle="Settings">
              <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Settings — coming soon
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
