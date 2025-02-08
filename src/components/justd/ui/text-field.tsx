'use client'

import { type ReactNode, useState } from 'react'

// biome-ignore lint/correctness/noUndeclaredDependencies: this is a valid import
import type { TextInputDOMProps } from '@react-types/shared'
import { IconEye, IconEyeClosed } from 'justd-icons'
import {
  Button as ButtonPrimitive,
  TextField as TextFieldPrimitive,
  type TextFieldProps as TextFieldPrimitiveProps,
} from 'react-aria-components'
import { twJoin } from 'tailwind-merge'

import type { FieldProps } from '@/components/justd/ui/field'
import {
  Description,
  FieldError,
  FieldGroup,
  Input,
  Label,
} from '@/components/justd/ui/field'
import { Loader } from '@/components/justd/ui/loader'
import { composeTailwindRenderProps } from '@/components/justd/ui/primitive'

type InputType = Exclude<TextInputDOMProps['type'], 'password'>

interface BaseTextFieldProps extends TextFieldPrimitiveProps, FieldProps {
  prefix?: ReactNode
  suffix?: ReactNode
  isPending?: boolean
  className?: string
}

interface RevealableTextFieldProps extends BaseTextFieldProps {
  isRevealable: true
  type: 'password'
}

interface NonRevealableTextFieldProps extends BaseTextFieldProps {
  isRevealable?: never
  type?: InputType
}

type TextFieldProps = RevealableTextFieldProps | NonRevealableTextFieldProps

const TextField = ({
  placeholder,
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  isPending,
  className,
  isRevealable,
  type,
  ...props
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: this is a complex component with multiple conditions and states
}: TextFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const inputType = isRevealable
    ? isPasswordVisible
      ? 'text'
      : 'password'
    : type
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev)
  }
  return (
    <TextFieldPrimitive
      type={inputType}
      {...props}
      className={composeTailwindRenderProps(
        className,
        'group flex flex-col gap-y-1.5',
      )}
    >
      {props.children ? (
        props.children
      ) : (
        <>
          {label && <Label>{label}</Label>}
          <FieldGroup
            isInvalid={!!errorMessage}
            isDisabled={props.isDisabled}
            className={twJoin(
              '**:[button]:inset-ring-0 **:[button]:inset-shadow-none **:[button]:h-8 **:[button]:rounded-[calc(var(--radius-lg)*0.5)] **:[button]:px-3.5 **:[button]:has-data-[slot=icon]:w-8 **:[button]:has-data-[slot=icon]:p-0 dark:**:[button]:inset-ring-0',
              '[&>[data-slot=suffix]>button]:mr-[calc(var(--spacing)*-1.7)] [&>[data-slot=suffix]>button]:data-focus-visible:outline-1 [&>[data-slot=suffix]>button]:data-focus-visible:outline-offset-1',
              '[&>[data-slot=prefix]>button]:ml-[calc(var(--spacing)*-1.7)] [&>[data-slot=prefix]>button]:data-focus-visible:outline-1 [&>[data-slot=prefix]>button]:data-focus-visible:outline-offset-1',
            )}
            data-loading={isPending ? 'true' : undefined}
          >
            {prefix ? (
              <span data-slot="prefix" className="atrs x2e2">
                {prefix}
              </span>
            ) : null}
            <Input placeholder={placeholder} />
            {isRevealable ? (
              <ButtonPrimitive
                type="button"
                aria-label="Toggle password visibility"
                onPress={handleTogglePasswordVisibility}
                className="relative mr-1 grid shrink-0 place-content-center rounded-sm border-transparent outline-hidden data-focus-visible:*:data-[slot=icon]:text-primary *:data-[slot=icon]:text-muted-fg"
              >
                {isPasswordVisible ? <IconEyeClosed /> : <IconEye />}
              </ButtonPrimitive>
            ) : isPending ? (
              <Loader variant="spin" data-slot="suffix" />
            ) : suffix ? (
              <span data-slot="suffix">{suffix}</span>
            ) : null}
          </FieldGroup>
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
    </TextFieldPrimitive>
  )
}

export type { TextFieldProps }
export { TextField }
