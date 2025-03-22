'use client'

import { Editor } from '@/components/ui/editor'
import { createMessageAction } from '@/features/messages/actions/create-message-action'

import { useParams } from 'next/navigation'
import type Quill from 'quill'
import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'

type ChatInputProps = { placeholder: string }

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const params = useParams<Record<'workspaceId' | 'channelId', string>>()
  const editorRef = useRef<Quill | null>(null)

  const [editorKey, setEditorKey] = useState(0)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = ({
    body,
    image,
  }: { body: string; image: File | null }) => {
    startTransition(async () => {
      const result = await createMessageAction({
        body,
        image,
        workspaceId: params.workspaceId,
        channelId: params.channelId,
      })

      if (result.status === 'error') {
        toast.error('Failed to send message')
      }

      toast.success('Message sent')
      setEditorKey((prev) => prev + 1)
    })
  }

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  )
}
