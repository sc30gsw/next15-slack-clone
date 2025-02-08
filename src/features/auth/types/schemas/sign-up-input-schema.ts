import { z } from 'zod'

const letterRegex = /[A-Za-z]/
const numberRegex = /[0-9]/

export const signUpInputSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email()
			.max(128, { message: 'Email is too long' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password is too short' })
			.max(256, { message: 'Password is too long' })
			.refine(
				(password: string) =>
					letterRegex.test(password) && numberRegex.test(password),
				'password must contain both letters and numbers',
			),
		passwordConfirmation: z
			.string({ required_error: 'Password confirmation is required' })
			.min(8, { message: 'Password confirmation is too short' })
			.max(256, { message: 'Password confirmation is too long' })
			.refine(
				(password: string) =>
					letterRegex.test(password) && numberRegex.test(password),
				'password must contain both letters and numbers',
			),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	})

export type SignUpInput = z.infer<typeof signUpInputSchema>
