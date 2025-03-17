import { Button } from '@/components/justd/ui'
import { deleteChannelAction } from '@/features/channels/actions/delete-channel-action'
import type { getWorkspaceCurrentMember } from '@/features/members/server/fetcher'
import { Confirm } from '@/hooks/use-confirm'
import { IconTrash } from 'justd-icons'
import { useParams, useRouter } from 'next/navigation'
import { use, useTransition } from 'react'
import { toast } from 'sonner'

export const DeleteChannelButton = ({
  currentMemberPromise,
}: Record<
  'currentMemberPromise',
  ReturnType<typeof getWorkspaceCurrentMember>
>) => {
  const currentMember = use(currentMemberPromise)

  const router = useRouter()
  const params = useParams<Record<'workspaceId' | 'channelId', string>>()

  const [isPending, startTransition] = useTransition()

  if (currentMember?.role !== 'admin') {
    return null
  }

  const deleteChannel = async () => {
    const ok = await Confirm.call({
      title: 'Delete this channel?',
      message:
        'You are about to delete this channel. This action is irreversible.',
    })

    if (!ok) {
      return
    }

    startTransition(async () => {
      try {
        await deleteChannelAction(params.channelId, params.workspaceId)
        toast.success('channel deleted')
        router.replace(`/workspace/${params.workspaceId}`)
      } catch (_) {
        toast.error('Failed to delete channel')
      }
    })
  }

  return (
    <Button
      intent="outline"
      size="large"
      isDisabled={isPending}
      onPress={deleteChannel}
      className="flex items-center justify-start gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
    >
      <IconTrash className="size-4" />
      <p className="text-sm font-semibold">Delete channel</p>
    </Button>
  )
}
