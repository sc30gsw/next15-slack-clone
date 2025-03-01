import { Button, Loader, Modal } from '@/components/justd/ui'
import { deleteWorkspaceAction } from '@/features/workspaces/actions/delete-workspace-action'
import { IconTrash } from 'justd-icons'
import { useParams, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type PreferencesModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  initialValue: string
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const params = useParams<Record<'workspaceId', string>>()
  const [value, setValue] = useState(initialValue)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const deleteWorkspace = () => {
    startTransition(async () => {
      await deleteWorkspaceAction(params.workspaceId)
      toast.success('Workspace deleted')

      router.push('/workspace/b1a18a27-a35f-4ff3-b7b0-e52d35e0cf93')
    })
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Content classNames={{ content: 'p-0 bg-gray-50 overflow-hidden' }}>
        <Modal.Header className="p-4 border-b bg-white">
          <Modal.Title>{value}</Modal.Title>
        </Modal.Header>
        <div className="flex flex-col gap-y-2 px-4 py-4">
          <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Workspace name</p>
              <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                Edit
              </p>
            </div>
            <p className="text-sm">{value}</p>
          </div>
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
        <form className="space-y-4">
          <Modal.Body>
            <input placeholder="hoge" />
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>Cancel</Modal.Close>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  )
}
