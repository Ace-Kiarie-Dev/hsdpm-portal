import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Wrench,
  TrendingUp,
  Calendar,
  FileText,
  BookOpen,
  Eye,
  Settings,
  LogOut,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import type { Role } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles?: Role[]
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/overview', icon: <LayoutDashboard size={18} /> },
  { label: 'Equipment', href: '/equipment', icon: <Wrench size={18} /> },
  { label: 'Growth', href: '/growth', icon: <TrendingUp size={18} /> },
  { label: 'Services', href: '/services', icon: <Calendar size={18} /> },
  { label: 'Requisitions', href: '/requisitions', icon: <FileText size={18} /> },
  { label: 'Minutes', href: '/minutes', icon: <BookOpen size={18} /> },
  { label: 'Pastor View', href: '/pastor', icon: <Eye size={18} />, roles: ['overseer'] },
  { label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
]

const CURRENT_ROLE: Role = 'member'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { logout } = useAuth()

  const visibleItems = navItems.filter(
    item => !item.roles || item.roles.includes(CURRENT_ROLE),
  )

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 64 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{
        background: 'var(--color-bg-sidebar)',
        borderRight: '1px solid var(--color-border)',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 20px',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
          <rect x="9" y="1" width="4" height="20" rx="2" fill="var(--color-accent)" />
          <rect x="1" y="8" width="20" height="4" rx="2" fill="var(--color-accent)" />
        </svg>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
            }}
          >
            HSDPM Portal
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {visibleItems.map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onToggle}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: isCollapsed ? '10px 20px' : '10px 12px',
              borderRadius: 10,
              marginBottom: 2,
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              background: isActive ? 'var(--color-accent-soft)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: isActive ? 500 : 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: 'background 150ms ease, color 150ms ease',
            })}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '12px 12px 8px',
          flexShrink: 0,
        }}
      >
        {!isCollapsed && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 4px',
              marginBottom: 6,
            }}
          >
            <Avatar style={{ width: 32, height: 32, flexShrink: 0 }}>
              <AvatarFallback
                style={{
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                PK
              </AvatarFallback>
            </Avatar>
            <div style={{ overflow: 'hidden' }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Peter Kiarie
              </p>
              <span
                style={{
                  fontSize: 11,
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  borderRadius: 99,
                  padding: '1px 8px',
                  fontWeight: 500,
                }}
              >
                Member
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <Avatar style={{ width: 32, height: 32 }}>
              <AvatarFallback
                style={{
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                PK
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: 8,
            padding: '8px 10px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            cursor: 'pointer',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-elevated)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}
