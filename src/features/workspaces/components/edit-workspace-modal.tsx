import { Button, Form, Loader, Modal, TextField } from '@/components/justd/ui'
import { updateWorkspaceAction } from '@/features/workspaces/actions/update-workspace-action'
import type { Workspace } from '@/features/workspaces/types'
import {
  type UpdateWorkspaceInput,
  updateWorkspaceInputSchema,
} from '@/features/workspaces/types/schemas/update-workspace-input-schema'
import { useSafeForm } from '@/hooks/use-safe-form'
import { withCallbacks } from '@/utils/with-callbacks'
import { getFormProps, getInputProps } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useParams } from 'next/navigation'
import { useActionState, useState } from 'react'
import { toast } from 'sonner'

type EditWorkspaceModalProps = {
  workspaceName: Workspace['name']
  isDisabled: boolean
}

export const EditWorkspaceModal = ({
  workspaceName,
  isDisabled,
}: EditWorkspaceModalProps) => {
  const params = useParams<Record<'workspaceId', string>>()

  const [open, setOpen] = useState(false)

  const [lastResult, action, isPending] = useActionState(
    withCallbacks(updateWorkspaceAction, {
      onError() {
        toast.error('Failed to update workspace')
      },
      onSuccess() {
        toast.success('Workspace updated')
        setOpen(false)
      },
    }),
    null,
  )

  const [form, fields] = useSafeForm<UpdateWorkspaceInput>({
    constraint: getZodConstraint(updateWorkspaceInputSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: updateWorkspaceInputSchema })
    },
    defaultValue: {
      id: params.workspaceId,
      name: workspaceName,
    },
  })

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger isDisabled={isDisabled}>
        <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Workspace name</p>
            <p className="text-sm text-[#1264a3] hover:underline font-semibold">
              Edit
            </p>
          </div>
          <p className="text-left text-sm">{workspaceName}</p>
        </div>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>Rename this workspace</Modal.Header>
        <Form {...getFormProps(form)} action={action} className="space-y-4">
          <input
            {...getInputProps(fields.id, { type: 'hidden' })}
            disabled={isPending}
          />
          <div className="mx-4">
            <TextField
              {...getInputProps(fields.name, { type: 'text' })}
              placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
              isDisabled={isPending}
              autoFocus={true}
              minLength={3}
              maxLength={80}
              errorMessage=""
              defaultValue={
                lastResult?.initialValue?.name.toString() ?? workspaceName
              }
            />
            <span id={fields.name.errorId} className="text-sm text-red-500">
              {fields.name.errors}
            </span>
          </div>

          <Modal.Footer className="flex items-center justify-end">
            <Modal.Close isDisabled={isPending} className="w-24">
              Cancel
            </Modal.Close>
            <Button
              type="submit"
              isDisabled={isPending}
              intent="secondary"
              className="w-24 text-white bg-zinc-900 hover:bg-zinc-950 data-hovered:bg-zinc-800/90 data-pressed:bg-zinc-800/90"
            >
              Save
              {isPending && <Loader />}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Content>
    </Modal>
  )
}
