import { motion } from 'framer-motion'
import { Wrench, Calendar, FileText, Users } from 'lucide-react'

interface StatCard {
  label: string
  value: number
  icon: React.ReactNode
}

const stats: StatCard[] = [
  { label: 'Equipment Items', value: 0, icon: <Wrench size={20} /> },
  { label: 'Upcoming Services', value: 0, icon: <Calendar size={20} /> },
  { label: 'Pending Requisitions', value: 0, icon: <FileText size={20} /> },
  { label: 'Members', value: 8, icon: <Users size={20} /> },
]

export function OverviewPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome card */}
      <div className="clay-card" style={{ padding: '28px 32px' }}>
        <h2
          style={{
            margin: '0 0 8px',
            fontFamily: 'var(--font-heading)',
            fontSize: 32,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          Welcome back, Peter
        </h2>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 15 }}>
          Here's what's happening with the media team today.
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3, ease: 'easeOut' }}
            className="clay-card"
            style={{ padding: '20px 24px' }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--color-accent-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent)',
                marginBottom: 14,
              }}
            >
              {stat.icon}
            </div>
            <p
              style={{
                margin: '0 0 4px',
                fontSize: 36,
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
                lineHeight: 1,
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: 'var(--color-text-secondary)',
              }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
