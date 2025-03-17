import { Button, Form, Loader, Modal, TextField } from '@/components/justd/ui'
import { updateChannelAction } from '@/features/channels/actions/update-channel-action'
import {
  type UpdateChannelInput,
  updateChannelInputSchema,
} from '@/features/channels/types/schemas/update-channel-input-schema'
import type { getWorkspaceCurrentMember } from '@/features/members/server/fetcher'
import { useSafeForm } from '@/hooks/use-safe-form'
import type { client } from '@/lib/rpc'
import { withCallbacks } from '@/utils/with-callbacks'
import { getFormProps, getInputProps, useInputControl } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { InferResponseType } from 'hono'
import { useParams } from 'next/navigation'
import { use, useActionState, useState } from 'react'
import { toast } from 'sonner'

type EditChannelModalPromise = Pick<
  InferResponseType<
    (typeof client.api.channels)[':workspaceId'][':channelId']['$get'],
    200
  >['channel'],
  'name'
> & {
  currentMemberPromise: ReturnType<typeof getWorkspaceCurrentMember>
}

export const EditChannelModal = ({
  name,
  currentMemberPromise,
}: EditChannelModalPromise) => {
  const currentMember = use(currentMemberPromise)

  const params = useParams<Record<'workspaceId' | 'channelId', string>>()

  const [open, setOpen] = useState(false)
  const handleOpen = (value: boolean) => {
    if (currentMember?.role !== 'admin') {
      return
    }

    setOpen(value)
  }

  const [lastResult, action, isPending] = useActionState(
    withCallbacks(updateChannelAction, {
      onError() {
        toast.error('Failed to update channel')
      },
      onSuccess() {
        toast.success('Channel updated')
        setOpen(false)
      },
    }),
    null,
  )

  const [form, fields] = useSafeForm<UpdateChannelInput>({
    constraint: getZodConstraint(updateChannelInputSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: updateChannelInputSchema })
    },
    defaultValue: {
      id: params.channelId,
      name,
      workspaceId: params.workspaceId,
    },
  })

  const fieldName = useInputControl(fields.name)

  return (
    <Modal isOpen={open} onOpenChange={handleOpen}>
      <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">channel name</p>
          {currentMember?.role === 'admin' && (
            <Modal.Trigger isDisabled={isPending}>
              <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                Edit
              </p>
            </Modal.Trigger>
          )}
        </div>
        <p className="text-sm text-left"># {name}</p>
      </div>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Rename this channel</Modal.Title>
        </Modal.Header>
        <Form {...getFormProps(form)} action={action} className="space-y-4">
          <input
            {...getInputProps(fields.id, { type: 'hidden' })}
            disabled={isPending}
          />
          <input
            {...getInputProps(fields.workspaceId, { type: 'hidden' })}
            disabled={isPending}
          />
          <div className="mx-4">
            <TextField
              {...getInputProps(fields.name, { type: 'text' })}
              placeholder="e.g. plan-budget"
              isDisabled={isPending}
              onChange={(e) => {
                const value = e.replace(/\s+/g, '-').toLowerCase()

                fieldName.change(value)
              }}
              value={fieldName.value}
              autoFocus={true}
              minLength={3}
              maxLength={80}
              errorMessage=""
              defaultValue={
                lastResult?.status !== 'error'
                  ? (lastResult?.initialValue?.name.toString() ?? name)
                  : ''
              }
            />
          </div>
          <Modal.Footer className="flex justify-end">
            <Modal.Close isDisabled={isPending}>Cancel</Modal.Close>
            <Button
              type="submit"
              intent="secondary"
              isDisabled={isPending}
              className="text-white bg-zinc-900 hover:bg-zinc-950 data-hovered:bg-zinc-800/90 data-pressed:bg-zinc-800/90 relative"
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
