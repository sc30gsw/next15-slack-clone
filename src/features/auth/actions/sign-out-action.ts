'use server'

import { signOut } from '@/auth'

export const signOutAction = async () => {
  await signOut({ redirect: true, redirectTo: '/sign-in' })
}
