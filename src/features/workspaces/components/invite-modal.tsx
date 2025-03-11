import { Button, Modal } from '@/components/justd/ui'
import { newJoinCodeAction } from '@/features/workspaces/actions/new-join-code-action'
import type { Workspace } from '@/features/workspaces/types'
import {} from '@/features/workspaces/types/schemas/update-workspace-input-schema'
import { Confirm } from '@/hooks/use-confirm'
import { cn } from '@/utils/classes'
import {} from '@conform-to/react'
import {} from '@conform-to/zod'
import { IconCopy } from '@tabler/icons-react'
import { IconRefresh } from 'justd-icons'
import { useParams } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

type InviteModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  workspaceName: Workspace['name']
  workspaceJoinCode: Workspace['joinCode']
}

export const InviteModal = ({
  open,
  setOpen,
  workspaceName,
  workspaceJoinCode,
}: InviteModalProps) => {
  const params = useParams<Record<'workspaceId', string>>()
  const [isPending, startTransition] = useTransition()

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${params.workspaceId}`

    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success('Invite link copied to clipboard')
    })
  }

  const handleNewCode = async () => {
    const ok = await Confirm.call({
      title: 'Are you sure?',
      message:
        'This will deactivate the current invite code and generate a new one.',
    })

    if (!ok) {
      return
    }

    startTransition(async () => {
      try {
        await newJoinCodeAction(params.workspaceId)
        toast.success('Invite code regenerated')
      } catch (_) {
        toast.error('Failed to regenerate invite code')
      }
    })
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Content classNames={{ content: 'p-0 bg-gray-50 overflow-hidden' }}>
        <Modal.Header className="p-4 border-b bg-white">
          <Modal.Title>Invite people to {workspaceName}</Modal.Title>
          <Modal.Description>
            Use the code below to invite people to your workspace
          </Modal.Description>
        </Modal.Header>
        <div className="flex flex-col gap-y-4 items-center justify-center py-10">
          <p className="text-4xl font-bold tracking-widest uppercase">
            {workspaceJoinCode}
          </p>
          <Button
            size="small"
            intent="plain"
            isDisabled={isPending}
            onPress={handleCopy}
            className="font-semibold text-black data-hovered:bg-neutral-200/60 data-pressed:bg-neutral-200/60"
          >
            Copy link
            <IconCopy stroke={2} className="size-4 ml-2" />
          </Button>
        </div>
        <Modal.Footer>
          <Button
            intent="outline"
            isDisabled={isPending}
            onPress={handleNewCode}
          >
            New code
            <IconRefresh
              className={cn('size-4 ml-2', isPending && 'animate-spin')}
            />
          </Button>

          <Modal.Close
            intent="secondary"
            isDisabled={isPending}
            className="text-white bg-zinc-900 hover:bg-zinc-950 data-hovered:bg-zinc-800/90 data-pressed:bg-zinc-800/90"
          >
            Close
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
