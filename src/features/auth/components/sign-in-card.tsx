import { Card } from '@/components/justd/ui'
import { SignInForm } from '@/features/auth/components/sign-in-form'
import Link from 'next/link'

export const SignInCard = () => {
	return (
		<Card className="w-full h-full p-8">
			<Card.Header className="px-0 pt-0">
				<Card.Title>Login to continue</Card.Title>
				<Card.Description>
					Use your email or another service to continue
				</Card.Description>
			</Card.Header>
			<Card.Content className="space-y-5 px-0 pb-0">
				<SignInForm />
				<p className="text-xs text-muted-foreground">
					Don&apos;t have an account?{' '}
					<Link
						href={'/sign-up'}
						className="text-sky-700 hover:underline cursor-pointer"
					>
						Sign up
					</Link>
				</p>
			</Card.Content>
		</Card>
	)
}
