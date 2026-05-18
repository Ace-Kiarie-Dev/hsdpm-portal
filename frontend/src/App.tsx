import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { OverviewPage } from '@/pages/OverviewPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route
        path="/overview"
        element={
          <DashboardLayout pageTitle="Overview">
            <OverviewPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/equipment"
        element={
          <DashboardLayout pageTitle="Equipment">
            <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>Equipment — coming soon</div>
          </DashboardLayout>
        }
      />
      <Route
        path="/growth"
        element={
          <DashboardLayout pageTitle="Growth">
            <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>Growth — coming soon</div>
          </DashboardLayout>
        }
      />
      <Route
        path="/services"
        element={
          <DashboardLayout pageTitle="Services">
            <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>Services — coming soon</div>
          </DashboardLayout>
        }
      />
      <Route
        path="/requisitions"
        element={
          <DashboardLayout pageTitle="Requisitions">
            <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>Requisitions — coming soon</div>
          </DashboardLayout>
        }
      />
      <Route
        path="/minutes"
        element={
          <DashboardLayout pageTitle="Minutes">
            <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>Minutes — coming soon</div>
          </DashboardLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <DashboardLayout pageTitle="Settings">
            <div className="p-8 text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>Settings — coming soon</div>
          </DashboardLayout>
        }
      />
    </Routes>
  )
}
