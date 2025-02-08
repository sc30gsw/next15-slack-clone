import { signUpAction } from '@/features/auth/actions/sign-up-action'
import {
  type SignUpInput,
  signUpInputSchema,
} from '@/features/auth/types/schemas/sign-up-input-schema'
import { useSafeForm } from '@/hooks/use-safe-form'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useActionState } from 'react'

export const useSignUp = () => {
  const [lastResult, action, isPending] = useActionState(signUpAction, null)

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
