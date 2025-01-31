'use client'

import { Button, Form, Separator, TextField } from '@/components/justd/ui'
import { OauthButton } from '@/features/auth/components/oauth-button'
import { IconBrandGithub } from 'justd-icons'

export const SignUpForm = () => {
	return (
		<>
			<Form className="space-y-2.5">
				<TextField
					type="email"
					placeholder="Email"
					value=""
					onChange={() => {}}
					isDisabled={false}
					isRequired={true}
				/>
				<TextField
					type="password"
					placeholder="Password"
					value=""
					onChange={() => {}}
					isDisabled={false}
					isRequired={true}
				/>
				<TextField
					type="password"
					placeholder="Confirm Password"
					value=""
					onChange={() => {}}
					isDisabled={false}
					isRequired={true}
				/>
				<Button
					type="submit"
					intent="secondary"
					// appearance="outline"
					size="large"
					isDisabled={false}
					className="w-full text-white bg-zinc-900 hover:bg-zinc-950 data-hovered:bg-zinc-800/90 data-pressed:bg-zinc-800/90"
				>
					Continue
				</Button>
			</Form>
			<Separator />
			<div className="flex flex-col gap-y-2.5">
				<OauthButton
					isDisabled={false}
					onClick={() => {}}
					icon={IconBrandGithub}
					label="Continue with Github"
				/>
				<OauthButton
					isDisabled={false}
					onClick={() => {}}
					icon={IconBrandGithub}
					label="Continue with Github"
				/>
			</div>
		</>
	)
}
