'use client'

import { Button } from '@/components/justd/ui'
import { usePanel } from '@/hooks/use-panel'
import type { ReactNode } from 'react'

type ConversationHeaderProps = {
  children: ReactNode
  memberId: string
}

export const ConversationHeader = ({
  children,
  memberId,
}: ConversationHeaderProps) => {
  const { onOpenProfile } = usePanel()

  return (
    <Button
      size="small"
      onPress={() => onOpenProfile(memberId)}
      className="bg-transparent hover:bg-accent/10 data-hovered:bg-accent/10 data-pressed:bg-accent/10 text-lg font-semibold px-2 overflow-hidden w-auto text-black border-none"
    >
      {children}
    </Button>
  )
}
