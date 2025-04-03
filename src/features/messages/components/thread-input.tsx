import { Editor } from '@/components/ui/editor'
import {
  getChannelMessagesCacheKey,
  getConversationMessagesCacheKey,
  getThreadsCacheKey,
} from '@/constants/cache-keys'
import { createMessageAction } from '@/features/messages/actions/create-message-action'
import { usePanel } from '@/hooks/use-panel'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import type Quill from 'quill'
import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'

export const ThreadInput = () => {
  const params = useParams<Record<'workspaceId' | 'channelId', string>>()
  const queryClient = useQueryClient()

  const editorRef = useRef<Quill | null>(null)

  const { parentMessageId } = usePanel()

  const [editorKey, setEditorKey] = useState(0)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = ({
    body,
    image,
  }: { body: string; image: File | null }) => {
    startTransition(async () => {
      editorRef?.current?.enable(false)

      const result = await createMessageAction({
        body,
        image,
        workspaceId: params.workspaceId,
        channelId: params.channelId,
        parentMessageId: parentMessageId ?? undefined,
      })

      if (result.status === 'error') {
        toast.error('Failed to send message')
        return
      }

      setEditorKey((prev) => prev + 1)
      editorRef?.current?.enable(true)

      queryClient.invalidateQueries({
        queryKey: [getChannelMessagesCacheKey, params.channelId],
      })

      queryClient.invalidateQueries({
        queryKey: [getThreadsCacheKey, parentMessageId],
      })

      if (result.initialValue?.conversationId) {
        queryClient.invalidateQueries({
          queryKey: [
            getConversationMessagesCacheKey,
            result.initialValue.conversationId,
          ],
        })
      }
    })
  }

  return (
    <Editor
      key={editorKey}
      onSubmit={handleSubmit}
      disabled={isPending}
      placeholder="Reply..."
      innerRef={editorRef}
    />
  )
}
