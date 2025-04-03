import { Button, Form, Menu } from '@/components/justd/ui'
import { Radio, RadioGroup } from '@/components/justd/ui/radio'
import { getMemberCacheKey } from '@/constants/cache-keys'
import { deleteMemberAction } from '@/features/members/actions/delete-member-action'
import { updateMemberAction } from '@/features/members/actions/update-member-action'
import {
  type MemberDetailInput,
  memberDetailInputSchema,
} from '@/features/members/types/schemas/member-detail-input-schema'
import { Confirm } from '@/hooks/use-confirm'
import { usePanel } from '@/hooks/use-panel'
import { useSafeForm } from '@/hooks/use-safe-form'
import type { client } from '@/lib/rpc'
import { withCallbacks } from '@/utils/with-callbacks'
import {
  getCollectionProps,
  getFormProps,
  getInputProps,
  useInputControl,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { InferResponseType } from 'hono'
import { IconChevronDown } from 'justd-icons'
import { type RefObject, useActionState, useRef, useTransition } from 'react'
import { toast } from 'sonner'
import { type VariantProps, tv } from 'tailwind-variants'

const memberOperateFormStyle = tv({
  base: 'mt-4',
  slots: {
    form: 'w-full',
    roleButton: 'w-full capitalize',
    removeButton: 'w-full',
    icon: 'size-4 ml-2',
  },
  variants: {
    variant: {
      remove: {
        base: 'flex items-center gap-2 ',
        roleButton: 'flex',
      },
      leave: {
        roleButton: 'hidden',
      },
    },
  },
})

type Member = Exclude<
  InferResponseType<
    (typeof client.api.members)['workspace-member'][':workspaceId'][':memberId']['$get'],
    200
  >['member'],
  null
>

type MemberOperateFormProps = {
  memberId: Member['userId']
  role: Member['role']
  workspaceId: string
} & VariantProps<typeof memberOperateFormStyle>

export const MemberOperateForm = ({
  memberId,
  role,
  workspaceId,
  variant = 'remove',
}: MemberOperateFormProps) => {
  const {
    base,
    form: formStyle,
    roleButton,
    removeButton,
    icon,
  } = memberOperateFormStyle({
    variant,
  })
  const { onClose } = usePanel()
  const queryClient = useQueryClient()

  const formRef = useRef<HTMLFormElement | null>(null)

  const [lastResult, action, isPending] = useActionState(
    withCallbacks(updateMemberAction, {
      onSuccess() {
        toast.success('Role changed')
        onClose()
        queryClient.invalidateQueries({
          queryKey: [getMemberCacheKey, memberId, workspaceId],
        })
      },
      onError() {
        toast.error('Failed to change role')
      },
    }),
    null,
  )

  const [isDeletionPending, startTransition] = useTransition()

  const [form, fields] = useSafeForm<MemberDetailInput>({
    constraint: getZodConstraint(memberDetailInputSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: memberDetailInputSchema })
    },
    defaultValue: {
      memberId,
      workspaceId,
      role,
    },
  })
  const roleControl = useInputControl(fields.role)

  const handleDelete = async () => {
    const ok = await Confirm.call({
      title: variant === 'remove' ? '' : 'Leave workspace',
      message:
        variant === 'remove'
          ? 'Remove member'
          : 'Are you sure you want to remove this member?',
    })

    if (!ok) {
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append(fields.memberId.name, fields.memberId.value ?? '')
      formData.append(fields.workspaceId.name, fields.workspaceId.value ?? '')

      const result = await deleteMemberAction(undefined, formData)

      if (result.status === 'error') {
        toast.error(
          variant === 'remove'
            ? 'Failed to remove member'
            : 'Failed to leave the workspace',
        )
        return
      }

      toast.success(
        variant === 'remove' ? 'Member removed' : 'You left the workspace',
      )

      onClose()
      queryClient.invalidateQueries({
        queryKey: [getMemberCacheKey, memberId, workspaceId],
      })
    })
  }

  return (
    <div className={base()}>
      <Form
        ref={formRef as RefObject<HTMLFormElement>}
        {...getFormProps(form)}
        action={action}
        className={formStyle()}
      >
        <input
          {...getInputProps(fields.memberId, { type: 'hidden' })}
          disabled={isPending || isDeletionPending}
        />
        <input
          {...getInputProps(fields.workspaceId, { type: 'hidden' })}
          disabled={isPending || isDeletionPending}
        />
        <Menu>
          <Menu.CustomTrigger
            intent="outline"
            isDisabled={isPending || isDeletionPending}
            className={roleButton()}
          >
            {role} <IconChevronDown className={icon()} />
          </Menu.CustomTrigger>
          <RadioGroup
            name={fields.role.name}
            value={roleControl.value}
            onChange={async (value) => {
              const ok = await Confirm.call({
                title: 'Confirm Update',
                message: 'Are you sure you want to update this member?',
              })

              if (!ok) {
                return
              }

              form.update({
                name: fields.role.name,
                value,
              })

              // ? If this timeout does not exist, role will not be changed on server actions
              setTimeout(() => {
                formRef.current?.requestSubmit()
              }, 10)
            }}
            className="w-full hover:text-white"
          >
            <Menu.Content placement="bottom">
              {getCollectionProps(fields.role, {
                type: 'radio',
                options: ['admin', 'member'],
              }).map((props) => (
                <Menu.Item key={crypto.randomUUID()}>
                  <Radio {...props} isDisabled={isPending}>
                    {props.value}
                  </Radio>
                </Menu.Item>
              ))}
            </Menu.Content>
          </RadioGroup>
        </Menu>
        <button type="submit" className="hidden" />
      </Form>
      <Button
        intent="outline"
        isDisabled={isPending || isDeletionPending}
        onPress={handleDelete}
        className={removeButton()}
      >
        {variant === 'remove' ? 'Remove' : 'Leave'}
      </Button>
    </div>
  )
}
