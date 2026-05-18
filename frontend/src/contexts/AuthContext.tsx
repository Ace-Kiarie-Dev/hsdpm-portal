import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { fetchUserProfile, apiClient } from '@/lib/api'
import type { User } from '@/types'

interface AuthContextValue {
  currentUser: FirebaseUser | null
  userProfile: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function parseFirebaseError(err: unknown): string {
  if (err instanceof Error) {
    const code = (err as { code?: string }).code ?? ''
    const map: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    }
    return map[code] ?? err.message
  }
  return 'An unexpected error occurred.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        try {
          const profile = await fetchUserProfile()
          setUserProfile(profile)
        } catch {
          // Profile fetch may fail during registration before backend record exists;
          // auth state is still valid.
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function login(email: string, password: string): Promise<void> {
    setError(null)
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const token = await credential.user.getIdToken()
      const res = await fetch(`${apiClient.baseURL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const profile = (await res.json()) as User
        setUserProfile(profile)
      }
    } catch (err) {
      const message = parseFirebaseError(err)
      setError(message)
      throw new Error(message)
    }
  }

  async function logout(): Promise<void> {
    await signOut(auth)
    setUserProfile(null)
    setCurrentUser(null)
  }

  function clearError() {
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, userProfile, loading, error, login, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
