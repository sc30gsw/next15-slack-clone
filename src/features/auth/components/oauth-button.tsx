import { Button, Loader } from '@/components/justd/ui'
import type { FC, SVGProps } from 'react'

type OauthButtonProps = {
	isDisabled: boolean
	isPending: boolean
	onClick: () => void
	icon: FC<SVGProps<SVGSVGElement>>
	label: string
}

export const OauthButton = ({
	isDisabled,
	isPending,
	onClick,
	icon: Icon,
	label,
}: OauthButtonProps) => {
	return (
		<Button
			isDisabled={isDisabled || isPending}
			appearance="outline"
			size="large"
			onPress={onClick}
			className="w-full relative"
		>
			<Icon className="size-5 absolute top-1.5 left-2.5" />
			{label}
			{!isPending && isDisabled && (
				<Loader className="absolute right-2.5 top-3" />
			)}
		</Button>
	)
}
