import 'quill/dist/quill.snow.css'
import { Button } from '@/components/justd/ui'
import { Hint } from '@/components/ui/hint'
import {
  type CreateMessageInput,
  crateMessageInputSchema,
} from '@/features/messages/types/schemas/create-message-input-schema'
import { useSafeForm } from '@/hooks/use-safe-form'
import { cn } from '@/utils/classes'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconLetterCase, IconMoodSmile, IconPhoto } from '@tabler/icons-react'
import { IconSend2 } from 'justd-icons'
import type { Delta, Op, QuillOptions } from 'quill'
import Quill from 'quill'
import {
  type RefObject,
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

type EditorValue = {
  image: File | null
  body: string
}

type EditorProps = {
  onSubmit: ({ image, body }: EditorValue) => void
  onCancel?: () => void
  placeholder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  innerRef?: RefObject<Quill | null>
  variant?: 'create' | 'update'
}

export const Editor = ({
  onCancel,
  onSubmit,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = 'create',
}: EditorProps) => {
  const [text, setText] = useState('')
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)

  const [lastResult, action, isPending] = useActionState(
    () => Promise.resolve({}),
    null,
  )

  const [form, fields] = useSafeForm<CreateMessageInput>({
    constraint: getZodConstraint(crateMessageInputSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: crateMessageInputSchema })
    },
    defaultValue: {
      text: '',
    },
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)

  useLayoutEffect(() => {
    submitRef.current = onSubmit
    placeholderRef.current = placeholder
    defaultValueRef.current = defaultValue
    disabledRef.current = disabled
  })

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    )

    const options = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                // TODO: Submit form
                return
              },
            },
            // biome-ignore lint/style/useNamingConvention: It needs to be in this format to work with Quill
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index ?? 0, '\n')
              },
            },
          },
        },
      },
    } as const satisfies QuillOptions

    const quill = new Quill(editorContainer, options)
    quillRef.current = quill
    quillRef.current.focus()

    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)

      if (container) {
        container.innerHTML = ''
      }

      if (quillRef) {
        quillRef.current = null
      }

      if (innerRef) {
        innerRef.current = null
      }
    }
  }, [innerRef])

  const toggleToolbar = () => {
    setIsToolbarVisible((prev) => !prev)

    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden')
    }
  }

  const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-5">
          <Hint
            label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}
            showArrow={false}
            disabled={disabled}
            onPress={toggleToolbar}
          >
            <div className="bg-transparent hover:bg-neutral-300/60 outline-none border-none font-semibold text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-300/60 data-pressed:bg-neutral-300/60 size-9 shrink-0 rounded-md cursor-pointer">
              <IconLetterCase stroke={2} />
            </div>
          </Hint>
          <Hint label="Emoji" showArrow={false} disabled={disabled}>
            <div className="bg-transparent hover:bg-neutral-300/60 outline-none border-none font-semibold text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-300/60 data-pressed:bg-neutral-300/60 size-9 shrink-0 rounded-md cursor-pointer">
              <IconMoodSmile stroke={2} />
            </div>
          </Hint>
          {variant === 'create' && (
            <Hint label="Image" showArrow={false} disabled={disabled}>
              <div className="bg-transparent hover:bg-neutral-300/60 outline-none border-none font-semibold text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-300/60 data-pressed:bg-neutral-300/60 size-9 shrink-0 rounded-md cursor-pointer">
                <IconPhoto stroke={2} />
              </div>
            </Hint>
          )}

          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button intent="outline" size="small" isDisabled={disabled}>
                Cancel
              </Button>
              <Button
                size="small"
                isDisabled={disabled || isEmpty}
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 data-hovered:bg-[#007a5a]/80 data-pressed:bg-[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              isDisabled={disabled || isEmpty}
              size="square-petite"
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-white hover:bg-white data-hovered:bg-white data-pressed:bg-white text-muted-fg'
                  : 'bg-[#007a5a] hover:bg-[#007a5a]/80 data-hovered:bg-[#007a5a]/80 data-pressed:bg-[#007a5a]/80 text-white',
              )}
            >
              <IconSend2 />
            </Button>
          )}
        </div>
      </div>
      <div className="p-2 text-[10px] text-muted-fg text-right">
        <p>
          <strong>Shift + Return</strong> to add a new line
        </p>
      </div>
    </div>
  )
}
