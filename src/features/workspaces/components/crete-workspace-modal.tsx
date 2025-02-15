'use client'

import { Button, Form, Loader, Modal, TextField } from '@/components/justd/ui'
import { createWorkspaceAction } from '@/features/workspaces/actions/create-workspace-action'
import {
  type CreateWorkspaceInput,
  createWorkspaceInputSchema,
} from '@/features/workspaces/types/schemas/create-workspace-input-schema'
import { useSafeForm } from '@/hooks/use-safe-form'
import { getFormProps, getInputProps } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { toast } from 'sonner'

export const CreateWorkSpaceModal = () => {
  const router = useRouter()

  const [lastResult, action, isPending] = useActionState<
    Awaited<ReturnType<typeof createWorkspaceAction>> | null,
    FormData
  >(async (prev, formData) => {
    const result = await createWorkspaceAction(prev, formData)

    if (result.status === 'success') {
      toast.success('Workspace created')

      router.push(`/workspace/${result.initialValue?.name}`)
    }

    return null
  }, null)

  const [form, fields] = useSafeForm<CreateWorkspaceInput>({
    constraint: getZodConstraint(createWorkspaceInputSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createWorkspaceInputSchema })
    },
    defaultValue: {
      name: '',
    },
  })

  return (
    <Modal isOpen={true}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Add a workspace</Modal.Title>
        </Modal.Header>
        <Form {...getFormProps(form)} action={action} className="space-y-4">
          <Modal.Body>
            <TextField
              {...getInputProps(fields.name, { type: 'text' })}
              placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
              isDisabled={isPending}
              autoFocus={true}
              minLength={3}
              errorMessage={''}
            />
            <span id={fields.name.errorId} className="text-sm text-red-500">
              {fields.name.errors}
            </span>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close isDisabled={isPending}>Cancel</Modal.Close>
            <Button
              type="submit"
              isDisabled={isPending}
              intent="secondary"
              className="w-24 text-white bg-zinc-900 hover:bg-zinc-950 data-hovered:bg-zinc-800/90 data-pressed:bg-zinc-800/90"
            >
              Create
              {isPending && <Loader />}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Content>
    </Modal>
  )
}
