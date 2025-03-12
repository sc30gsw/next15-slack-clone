'use client'

import { Button, Form, Loader, Modal, TextField } from '@/components/justd/ui'
import { createChannelAction } from '@/features/channels/actions/create-channel-action'
import { useCreteChannelModal } from '@/features/channels/hooks/use-create-channel-modal'
import {
  type CreateChannelInput,
  createChannelInputSchema,
} from '@/features/channels/types/schemas/create-channel-schema'
import { useSafeForm } from '@/hooks/use-safe-form'
import { withCallbacks } from '@/utils/with-callbacks'
import { getFormProps, getInputProps, useInputControl } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useParams } from 'next/navigation'
import { useActionState } from 'react'
import { toast } from 'sonner'

export const CreateChannelModal = () => {
  const params = useParams<Record<'workspaceId', string>>()

  const [open, setOpen] = useCreteChannelModal()

  const [lastResult, action, isPending] = useActionState(
    withCallbacks(createChannelAction, {
      onSuccess() {
        toast.success('Channel created')
        setOpen(false)
      },
      onError() {
        toast.error('Failed to create channel')
      },
    }),
    null,
  )

  const [form, fields] = useSafeForm<CreateChannelInput>({
    constraint: getZodConstraint(createChannelInputSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createChannelInputSchema })
    },
    defaultValue: {
      name: '',
      workspaceId: params.workspaceId,
    },
  })

  const name = useInputControl(fields.name)

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Add a channel</Modal.Title>
        </Modal.Header>
        <Form {...getFormProps(form)} action={action} className="space-y-4">
          <Modal.Body>
            <input
              {...getInputProps(fields.workspaceId, { type: 'hidden' })}
              disabled={isPending}
            />
            <TextField
              {...getInputProps(fields.name, { type: 'text' })}
              placeholder="e.g. plan-budget"
              isDisabled={isPending}
              onChange={(e) => {
                const value = e.replace(/\s+/g, '-').toLowerCase()

                name.change(value)
              }}
              value={name.value}
              // e.target.value.replace(/\s+/g, "-").toLowerCase()
              autoFocus={true}
              minLength={3}
              maxLength={80}
              errorMessage={''}
            />
            <span id={fields.name.errorId} className="text-sm text-red-500">
              {fields.name.errors}
            </span>
          </Modal.Body>
          <Modal.Footer className="flex justify-end">
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
