import { auth } from '@/lib/firebase'
import type { User } from '@/types'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:4000'

export const apiClient = {
  baseURL: BASE_URL,
}

export async function getAuthHeaders(): Promise<{ Authorization: string }> {
  const user = auth.currentUser
  if (!user) throw new Error('No authenticated user')
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

export async function fetchUserProfile(): Promise<User> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${BASE_URL}/api/users/me`, { headers })
  if (!res.ok) throw new Error(`Failed to fetch user profile: ${res.status}`)
  return res.json() as Promise<User>
}
