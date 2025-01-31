'use client'

import type {
	FieldErrorProps as FieldErrorPrimitiveProps,
	GroupProps,
	InputProps as InputPrimitiveProps,
	LabelProps,
	TextFieldProps as TextFieldPrimitiveProps,
	TextProps,
	ValidationResult,
} from 'react-aria-components'
import {
	FieldError as FieldErrorPrimitive,
	Group,
	Input as InputPrimitive,
	Label as LabelPrimitive,
	Text,
	composeRenderProps,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import {
	composeTailwindRenderProps,
	focusStyles,
} from '@/components/justd/ui/primitive'
import type { RefObject } from 'react'

interface FieldProps {
	label?: string
	placeholder?: string
	description?: string
	errorMessage?: string | ((validation: ValidationResult) => string)
	'aria-label'?: TextFieldPrimitiveProps['aria-label']
	'aria-labelledby'?: TextFieldPrimitiveProps['aria-labelledby']
}

const fieldStyles = tv({
	slots: {
		description: 'text-pretty text-muted-fg text-sm/6',
		label: 'w-fit cursor-default font-medium text-secondary-fg text-sm',
		fieldError: 'text-danger text-sm/6 forced-colors:text-[Mark]',
		input: [
			'w-full min-w-0 bg-transparent px-2.5 py-2 text-base text-fg placeholder-muted-fg outline-hidden data-focused:outline-hidden sm:text-sm [&::-ms-reveal]:hidden',
		],
	},
})

const { description, label, fieldError, input } = fieldStyles()

const Label = ({ className, ...props }: LabelProps) => {
	return <LabelPrimitive {...props} className={label({ className })} />
}

interface DescriptionProps extends TextProps {
	isWarning?: boolean
	ref?: RefObject<HTMLElement>
}

const Description = ({ ref, className, ...props }: DescriptionProps) => {
	const isWarning = props.isWarning ?? false
	return (
		<Text
			ref={ref}
			{...props}
			slot="description"
			className={description({
				className: isWarning ? 'text-warning' : className,
			})}
		/>
	)
}

interface FieldErrorProps extends FieldErrorPrimitiveProps {
	ref?: RefObject<HTMLElement>
}
const FieldError = ({ className, ref, ...props }: FieldErrorProps) => {
	return (
		<FieldErrorPrimitive
			ref={ref}
			{...props}
			className={composeTailwindRenderProps(className, fieldError())}
		/>
	)
}

const fieldGroupStyles = tv({
	base: [
		'group flex h-10 items-center overflow-hidden rounded-lg border border-input transition duration-200 ease-out',
		'focus-within:ring-4 group-data-invalid:focus-within:border-danger group-data-invalid:focus-within:ring-danger/20',
		'[&>[role=progressbar]]:mr-2.5',
		'**:data-[slot=icon]:size-4 **:data-[slot=icon]:shrink-0',
		'*:data-[slot=suffix]:mr-2.5 *:data-[slot=suffix]:text-muted-fg',
		'*:data-[slot=prefix]:ml-2.5 *:data-[slot=prefix]:text-muted-fg',
	],
	variants: {
		isFocusWithin: focusStyles.variants.isFocused,
		isInvalid: focusStyles.variants.isInvalid,
		isDisabled: {
			true: 'opacity-50 forced-colors:border-[GrayText]',
		},
	},
})

const FieldGroup = ({ className, ...props }: GroupProps) => {
	return (
		<Group
			{...props}
			className={composeRenderProps(className, (className, renderProps) =>
				fieldGroupStyles({
					...renderProps,
					className,
				}),
			)}
		/>
	)
}

interface InputProps extends InputPrimitiveProps {
	ref?: RefObject<HTMLInputElement>
}
const Input = ({ className, ref, ...props }: InputProps) => {
	return (
		<InputPrimitive
			ref={ref}
			{...props}
			className={composeTailwindRenderProps(className, input())}
		/>
	)
}

export type { FieldProps, InputProps, FieldErrorProps }
export { Description, FieldError, FieldGroup, Input, Label }
