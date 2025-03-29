'use client'

import { Button } from '@/components/justd/ui'
import { usePanel } from '@/features/messages/hooks/use-panel'
import { IconX } from 'justd-icons'

export const ThreadCloseButton = () => {
  const { onClose } = usePanel()

  return (
    <Button
      onPress={onClose}
      size="square-petite"
      intent="plain"
      className="bg-transparent hover:bg-accent/10 data-hovered:bg-accent/10 data-pressed:bg-accent/10"
    >
      <IconX className="size-5 stroke-[1.5]" />
    </Button>
  )
}
