'use client'

import { Modal, Skeleton } from '@/components/justd/ui'
import { DeleteChannelButton } from '@/features/channels/components/delete-channel-button'
import { EditChannelModal } from '@/features/channels/components/edit-channel-modal'
import type { getWorkspaceCurrentMember } from '@/features/members/server/fetcher'
import type { client } from '@/lib/rpc'
import type { InferResponseType } from 'hono'
import { IconChevronDown } from 'justd-icons'
import {} from 'next/navigation'
import { Suspense } from 'react'

type ChannelHeaderModalProps = Pick<
  InferResponseType<
    (typeof client.api.channels)[':workspaceId'][':channelId']['$get'],
    200
  >['channel'],
  'name'
> & {
  currentMemberPromise: ReturnType<typeof getWorkspaceCurrentMember>
}

export const ChannelHeaderModal = ({
  name,
  currentMemberPromise,
}: ChannelHeaderModalProps) => {
  return (
    <Modal>
      <Modal.Trigger>
        <div className="flex items-center inset-ring-0 inset-shadow-none pressed:bg-secondary outline-ring [--btn-border:transparent] hover:bg-secondary h-9 px-2 text-lg w-auto font-semibold overflow-hidden cursor-pointer rounded-md">
          <span className="truncate"># {name}</span>
          <IconChevronDown className="size-2.5 ml-2.5" />
        </div>
      </Modal.Trigger>
      <Modal.Content classNames={{ content: 'p-0 bg-gray-50 overflow-hidden' }}>
        <Modal.Header className="p-4 border-b bg-white">
          <Modal.Title># {name}</Modal.Title>
        </Modal.Header>
        <div className="px-4 py-4 flex flex-col gap-y-2">
          <Suspense
            fallback={
              <div className="flex flex-col gap-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-30" />
              </div>
            }
          >
            <EditChannelModal
              name={name}
              currentMemberPromise={currentMemberPromise}
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-11 w-111" />}>
            <DeleteChannelButton currentMemberPromise={currentMemberPromise} />
          </Suspense>
        </div>
      </Modal.Content>
    </Modal>
  )
}
