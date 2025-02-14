'use server'

import { signIn } from '@/auth'
import { db } from '@/db/db'
import { users } from '@/db/schema'
import { signUpInputSchema } from '@/features/auth/types/schemas/sign-up-input-schema'
import { parseWithZod } from '@conform-to/zod'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { AuthError } from 'next-auth'

export const signUpAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, { schema: signUpInputSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, submission.value.email),
    })

    if (existingUser) {
      return submission.reply({
        fieldErrors: { message: ['Email already in use'] },
      })
    }

    const hashedPassword = await bcrypt.hash(submission.value.password, 10)

    const [newUser] = await db
      .insert(users)
      .values({
        email: submission.value.email,
        hashedPassword,
        image: '',
      })
      .returning()

    await signIn('credentials', {
      email: newUser.email,
      password: submission.value.password,
      redirect: true,
      redirectTo: '/',
    })

    return submission.reply()
  } catch (err) {
    if (err instanceof AuthError) {
      return submission.reply({
        fieldErrors: {
          message: [err.cause?.err?.message ?? 'Something went wrong'],
        },
      })
    }

    return submission.reply({
      fieldErrors: {
        message: ['Something went wrong'],
      },
    })
  }
}
