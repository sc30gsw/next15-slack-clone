'use client'

import { Button } from '@/components/justd/ui'
import type { ReactNode } from 'react'

type ConversationHeaderProps = {
  children: ReactNode
}

export const ConversationHeader = ({ children }: ConversationHeaderProps) => {
  return (
    <Button
      size="small"
      // onPress={onClick}
      className="bg-transparent hover:bg-accent/10 data-hovered:bg-accent/10 data-pressed:bg-accent/10 text-lg font-semibold px-2 overflow-hidden w-auto text-black border-none"
    >
      {children}
    </Button>
  )
}
