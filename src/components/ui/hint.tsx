'use client'

import { Tooltip } from '@/components/justd/ui'
import type { ComponentProps, ReactNode } from 'react'

type HintProps = {
  label: string
  children: ReactNode
  disabled?: boolean
  placement?: ComponentProps<typeof Tooltip.Content>['placement']
  showArrow?: ComponentProps<typeof Tooltip.Content>['showArrow']
  onPress?: () => void
}

export const Hint = ({
  label,
  children,
  disabled,
  placement,
  showArrow,
  onPress,
}: HintProps) => {
  return (
    <Tooltip delay={50}>
      <Tooltip.Trigger isDisabled={disabled} onPress={onPress}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Content
        placement={placement}
        showArrow={showArrow}
        className="bg-black text-white border border-white/5"
      >
        <p className="font-medium text-xs">{label}</p>
      </Tooltip.Content>
    </Tooltip>
  )
}
