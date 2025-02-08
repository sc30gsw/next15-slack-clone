import { z } from 'zod'

const letterRegex = /[A-Za-z]/
const numberRegex = /[0-9]/

export const signInInputSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email()
    .max(128, { message: 'Email is too long' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8)
    .max(256, { message: 'Password is too long' })
    .refine(
      (password: string) =>
        letterRegex.test(password) && numberRegex.test(password),
      'password must contain both letters and numbers',
    ),
})

export type SignInInput = z.infer<typeof signInInputSchema>
