'use client'

import { CreateChannelModal } from '@/features/channels/components/crete-channel-modal'
import { CreateWorkSpaceModal } from '@/features/workspaces/components/crete-workspace-modal'
import { useEffect, useState } from 'react'

export const Modals = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <CreateWorkSpaceModal />
      <CreateChannelModal />
    </>
  )
}
