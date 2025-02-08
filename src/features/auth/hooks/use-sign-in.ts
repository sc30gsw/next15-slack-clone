import { signInAction } from '@/features/auth/actions/sign-in-action'
import {
  type SignInInput,
  signInInputSchema,
} from '@/features/auth/types/schemas/sign-in-input-schema'
import { useSafeForm } from '@/hooks/use-safe-form'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useActionState } from 'react'

export const useSignIn = () => {
  const [lastResult, action, isPending] = useActionState(signInAction, null)

  const [form, fields] = useSafeForm<SignInInput>({
    constraint: getZodConstraint(signInInputSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInInputSchema })
    },
    defaultValue: {
      email: '',
      password: '',
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
