import { Button } from '@/components/justd/ui'
import type { FC, SVGProps } from 'react'

type OauthButtonProps = {
	isDisabled: boolean
	onClick: () => void
	icon: FC<SVGProps<SVGSVGElement>>
	label: string
}

export const OauthButton = ({
	isDisabled,
	onClick,
	icon: Icon,
	label,
}: OauthButtonProps) => {
	return (
		<Button
			isDisabled={isDisabled}
			appearance="outline"
			size="large"
			onPress={onClick}
			className="w-full relative"
		>
			<Icon className="size-5 absolute top-1.5 left-2.5" />
			{label}
		</Button>
	)
}
