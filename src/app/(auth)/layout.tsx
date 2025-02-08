import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

const AuthLayout = async ({ children }: { children: ReactNode }) => {
	const session = await getSession()

	if (session) {
		redirect('/')
	}

	return (
		<div className="h-full flex items-center justify-center bg-[#5C3B58]">
			<div className="md:h-auto md:w-[420px]">{children}</div>
		</div>
	)
}

export default AuthLayout
