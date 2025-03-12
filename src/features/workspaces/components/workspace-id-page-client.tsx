'use client'

import { useCreteChannelModal } from '@/features/channels/hooks/use-create-channel-modal'
import { useEffect } from 'react'

export const WorkspaceIdPageClient = () => {
  const [open, setOpen] = useCreteChannelModal()

  useEffect(() => {
    if (!open) {
      setOpen(true)
    }
  }, [open, setOpen])

  return null
}
