import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { login, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    clearError()
    try {
      await login(data.email, data.password)
      navigate('/overview', { replace: true })
    } catch {
      // error is already set in AuthContext
    }
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    marginBottom: 6,
  }

  const fieldErrorStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        padding: '24px 16px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="clay-card"
        style={{ width: '100%', maxWidth: 420, padding: 40 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="10" y="1" width="4" height="22" rx="2" fill="var(--color-accent)" />
              <rect x="1" y="9" width="22" height="4" rx="2" fill="var(--color-accent)" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              HSDPM Portal
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: 'var(--color-text-secondary)',
            }}
          >
            Media Team Operations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label htmlFor="email" style={labelStyle}>
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@hsdpm.org"
                autoComplete="email"
                {...register('email')}
                style={{ height: 42, fontSize: 14 }}
              />
              {errors.email && (
                <p style={fieldErrorStyle}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  style={{ height: 42, fontSize: 14, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p style={fieldErrorStyle}>{errors.password.message}</p>
              )}
            </div>

            {/* Auth error */}
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(220, 38, 38, 0.08)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  borderRadius: 10,
                  fontSize: 13,
                  color: '#dc2626',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: 4,
                width: '100%',
                height: 46,
                background: isSubmitting
                  ? 'var(--color-accent)'
                  : 'var(--color-accent)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 15,
                fontWeight: 500,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.75 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'opacity var(--transition-base)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {isSubmitting ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                  style={{
                    display: 'block',
                    width: 18,
                    height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                  }}
                />
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p
          style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
          }}
        >
          Access is restricted to media team members.
        </p>
      </motion.div>
    </div>
  )
}
