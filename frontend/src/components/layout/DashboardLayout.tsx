import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface DashboardLayoutProps {
  children: ReactNode
  pageTitle: string
}

export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarWidth = isCollapsed ? 64 : 260

  function handleToggle() {
    if (window.innerWidth < 768) {
      setMobileOpen(prev => !prev)
    } else {
      setIsCollapsed(prev => !prev)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 39,
          }}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className="block md:hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 40,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 250ms ease',
        }}
      >
        <Sidebar isCollapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      {/* Main content */}
      <motion.div
        animate={{ marginLeft: window.innerWidth >= 768 ? sidebarWidth : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        <Topbar pageTitle={pageTitle} onToggle={handleToggle} />
        <main style={{ flex: 1, padding: 24 }}>{children}</main>
      </motion.div>
    </div>
  )
}
