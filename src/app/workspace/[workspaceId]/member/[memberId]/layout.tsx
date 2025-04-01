'use client'

import { Loader } from '@/components/justd/ui'
import { createConversationAction } from '@/features/conversations/actions/create-conversation-action'
import { IconTriangleExclamation } from 'justd-icons'
import { useParams } from 'next/navigation'
import { type ReactNode, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

const MemberIdLayout = ({
  children,
}: {
  children: ReactNode
}) => {
  const params = useParams<Record<'workspaceId' | 'memberId', string>>()
  const [isPending, startTransition] = useTransition()
  const [conversation, setConversation] = useState<string | undefined>()

  useEffect(() => {
    startTransition(async () => {
      const result = await createConversationAction({
        workspaceId: params.workspaceId,
        memberId: params.memberId,
      })

      if (result.status === 'error') {
        toast.error('Failed to create or get conversation')
        setConversation('error')

        return
      }

      setConversation(result.initialValue?.conversation)
    })
  }, [params.workspaceId, params.memberId])

  if (isPending || !conversation) {
    return (
      <div className="h-full flex-1 relative">
        <Loader
          size="medium"
          intent="secondary"
          className="animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    )
  }

  if (conversation === 'error') {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center">
        <IconTriangleExclamation className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-fg">Conversation not found</span>
      </div>
    )
  }

  return <>{children}</>
}

export default MemberIdLayout
