'use client'

import { CreateChannelModal } from '@/features/channels/components/crete-channel-modal'
import { CreateWorkSpaceModal } from '@/features/workspaces/components/crete-workspace-modal'

export const Modals = () => {
  return (
    <>
      <CreateWorkSpaceModal />
      <CreateChannelModal />
    </>
  )
}
