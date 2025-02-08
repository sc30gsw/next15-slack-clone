'use server'

import { signIn } from '@/auth'

export const oauthSignInAction = async (
  _: unknown,
  provider: Parameters<typeof signIn>[0],
) => {
  await signIn(provider, { redirect: true, redirectTo: '/' })
}
