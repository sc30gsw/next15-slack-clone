import { signUpAction } from '@/features/auth/actions/sign-up-action'
import {
	type SignUpInput,
	signUpInputSchema,
} from '@/features/auth/types/schemas/sign-up-input-schema'
import { useSafeForm } from '@/hooks/use-safe-form'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useActionState } from 'react'
import { toast } from 'sonner'

export const useSignUp = () => {
	const [lastResult, action, isPending] = useActionState<
		Awaited<ReturnType<typeof signUpAction>> | null,
		FormData
	>(async (prev, formData) => {
		const result = await signUpAction(prev, formData)

		if (result.status === 'error') {
			toast.warning(
				result.error && Array.isArray(result.error.message)
					? result.error.message[0]
					: 'Something went wrong',
			)

			return result
		}

		return result
	}, null)

	const [form, fields] = useSafeForm<SignUpInput>({
		constraint: getZodConstraint(signUpInputSchema),
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: signUpInputSchema })
		},
		defaultValue: {
			email: '',
			password: '',
			passwordConfirmation: '',
		},
	})

	return {
		form,
		fields,
		lastResult,
		action,
		isPending,
	}
}
