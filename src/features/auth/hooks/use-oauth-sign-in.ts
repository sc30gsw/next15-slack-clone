import { oauthSignInAction } from '@/features/auth/actions/o-auth-sign-in-action'
import { useActionState } from 'react'

export const useOauthSignIn = () => {
	const [, action, isPending] = useActionState(oauthSignInAction, null)

	return {
		action,
		isPending,
	}
}
