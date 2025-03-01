import { Button, Loader, Modal } from '@/components/justd/ui'
import { deleteWorkspaceAction } from '@/features/workspaces/actions/delete-workspace-action'
import { EditWorkspaceModal } from '@/features/workspaces/components/edit-workspace-modal'
import type { Workspace } from '@/features/workspaces/types'
import { Confirm } from '@/hooks/use-confirm'
import { IconTrash } from 'justd-icons'
import { useParams, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

type PreferencesModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  workspaceName: Workspace['name']
}

export const PreferencesModal = ({
  open,
  setOpen,
  workspaceName,
}: PreferencesModalProps) => {
  const router = useRouter()
  const params = useParams<Record<'workspaceId', string>>()

  const [isPending, startTransition] = useTransition()

  const deleteWorkspace = async () => {
    const ok = await Confirm.call({
      title: 'Are you sure?',
      message: 'This action is irreversible.',
    })

    if (!ok) {
      return
    }

    startTransition(async () => {
      try {
        await deleteWorkspaceAction(params.workspaceId)
        toast.success('Workspace deleted')
        router.replace('/')
      } catch (_) {
        toast.error('Failed to delete workspace')
      }
    })
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Content classNames={{ content: 'p-0 bg-gray-50 overflow-hidden' }}>
        <Modal.Header className="p-4 border-b bg-white">
          <Modal.Title>{workspaceName}</Modal.Title>
        </Modal.Header>
        <div className="flex flex-col gap-y-2 px-4 py-4">
          <EditWorkspaceModal
            workspaceName={workspaceName}
            isDisabled={isPending}
          />
          <Button
            isDisabled={isPending}
            onPress={deleteWorkspace}
            className="flex justify-between items-center gap-x-2 px-5 py-4 bg-white rounded-lg border border-gray-250 cursor-pointer hover:bg-gray-50 data-hovered:bg-gray-50 data-pressed:bg-gray-50 text-rose-600"
          >
            <div className="flex items-center gap-x-2">
              <IconTrash className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </div>

            {isPending && <Loader />}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  )
}
