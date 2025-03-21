'use client'

import { Editor } from '@/components/ui/editor'
import type Quill from 'quill'
import { useRef } from 'react'

type ChatInputProps = { placeholder: string }

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null)

  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  )
}
