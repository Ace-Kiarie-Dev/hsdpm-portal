import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { apiClient } from '@/lib/api'
import { Input } from '@/components/ui/input'

const DEPARTMENTS = ['Sound', 'Media', 'Streaming', 'Equipment', 'General'] as const

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    department: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

function parseFirebaseError(err: unknown): string {
  if (err instanceof Error) {
    const code = (err as { code?: string }).code ?? ''
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    }
    return map[code] ?? err.message
  }
  return 'An unexpected error occurred.'
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    setSubmitError(null)
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      )
      const token = await credential.user.getIdToken()

      const res = await fetch(`${apiClient.baseURL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          department: data.department === '' ? undefined : data.department,
          firebaseUid: credential.user.uid,
        }),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string }
        throw new Error(body.message ?? 'Failed to create account. Please try again.')
      }

      navigate('/overview', { replace: true })
    } catch (err) {
      setSubmitError(parseFirebaseError(err))
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
              Create Account
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: 'var(--color-text-secondary)',
            }}
          >
            Join the HSDPM media team
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Full Name */}
            <div>
              <label htmlFor="name" style={labelStyle}>
                Full name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Peter Kiarie"
                autoComplete="name"
                {...register('name')}
                style={{ height: 42, fontSize: 14 }}
              />
              {errors.name && (
                <p style={fieldErrorStyle}>{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" style={labelStyle}>
                Email address
              </label>
              <Input
                id="reg-email"
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

            {/* Department */}
            <div>
              <label htmlFor="department" style={labelStyle}>
                Department <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <select
                id="department"
                {...register('department')}
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 12px',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  color: 'var(--color-text-primary)',
                  fontSize: 14,
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'auto',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p style={fieldErrorStyle}>{errors.department.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" style={labelStyle}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>
                Confirm password
              </label>
              <div style={{ position: 'relative' }}>
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  style={{ height: 42, fontSize: 14, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
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
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={fieldErrorStyle}>{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit error */}
            {submitError && (
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
                {submitError}
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
                background: 'var(--color-accent)',
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
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Sign in link */}
        <p
          style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--color-text-secondary)',
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
