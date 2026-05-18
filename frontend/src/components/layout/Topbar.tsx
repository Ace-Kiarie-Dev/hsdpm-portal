import { Menu, Sun, Moon, Bell } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useTheme } from '@/components/providers/ThemeProvider'

interface TopbarProps {
  pageTitle: string
  onToggle: () => void
}

export function Topbar({ pageTitle, onToggle }: TopbarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      style={{
        height: 64,
        position: 'sticky',
        top: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--color-shadow-card)',
        zIndex: 30,
        boxSizing: 'border-box',
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: 6,
            borderRadius: 8,
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-elevated)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          <Menu size={20} />
        </button>
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-primary)',
          }}
        >
          {pageTitle}
        </h1>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: 6,
            borderRadius: 8,
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-elevated)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Bell */}
        <button
          aria-label="Notifications"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: 6,
            borderRadius: 8,
            position: 'relative',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-elevated)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-accent-amber)',
              border: '1.5px solid var(--color-bg-surface)',
            }}
          />
        </button>

        {/* Avatar */}
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
    </header>
  )
}
