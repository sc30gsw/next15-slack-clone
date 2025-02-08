'use client'
import { signOutAction } from '@/features/auth/actions/sign-out-action'

const TestPage = () => {
	return (
		<button
			type="button"
			onClick={async () => {
				await signOutAction()
			}}
		>
			sign out
		</button>
	)
}

export default TestPage
