'use server'

import { signIn } from '@/auth'
import { signInInputSchema } from '@/features/auth/types/schemas/sign-in-input-schema'
import { parseWithZod } from '@conform-to/zod'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export const signInAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, { schema: signInInputSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    await signIn('credentials', {
      email: submission.value.email,
      password: submission.value.password,
      redirect: true,
      redirectTo: '/',
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return submission.reply({
        fieldErrors: {
          message: [err.cause?.err?.message ?? 'Something went wrong'],
        },
      })
    }

    if (err instanceof Error) {
      if (err.message === 'NEXT_REDIRECT') {
        redirect('/')
      }

      return submission.reply({
        fieldErrors: {
          message: ['Something went wrong'],
        },
      })
    }
  }

  return submission.reply()
}
