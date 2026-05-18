export type Role = 'member' | 'dept_head' | 'overseer'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department?: string
  avatarUrl?: string
}

export type Theme = 'light' | 'dark'

export interface NavItem {
  label: string
  href: string
  icon: string
  roles?: Role[]
}
