import 'quill/dist/quill.snow.css'
import { Button } from '@/components/justd/ui'
import { EmojiPopover } from '@/components/ui/emoji-popover'
import { Hint } from '@/components/ui/hint'
import {} from '@/features/messages/types/schemas/create-message-input-schema'
import { cn } from '@/utils/classes'
import {} from '@conform-to/zod'
import { IconLetterCase, IconMoodSmile, IconPhoto } from '@tabler/icons-react'
import { IconSend2, IconX } from 'justd-icons'
import Image from 'next/image'
import type { Delta, Op, QuillOptions } from 'quill'
import Quill from 'quill'
import {
  type RefObject,
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
  placeholder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  innerRef?: RefObject<Quill | null>
  variant?: 'create' | 'update'
  onCancel?: () => void
}

export const Editor = ({
  onSubmit,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = 'create',
  onCancel,
}: EditorProps) => {
  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)
  const imageElementRef = useRef<HTMLInputElement>(null)

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
                const text = quill.getText()
                const addedImage = imageElementRef.current?.files?.[0] ?? null

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, '').trim().length === 0

                if (isEmpty) {
                  return
                }

                const body = JSON.stringify(quill.getContents())

                submitRef.current({
                  body,
                  image: addedImage,
                })

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

  const onEmojiSelect = (
    emoji: Record<'id' | 'name' | 'native' | 'shortcodes' | 'unified', string> &
      Record<'keywords', string[]>,
  ) => {
    const quill = quillRef.current

    quill?.insertText(quill?.getSelection()?.index ?? 0, emoji.native)
  }

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0

  return (
    <div className="flex flex-col">
      <input
        ref={imageElementRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        className="hidden"
      />
      <div
        className={cn(
          'flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white',
          disabled && 'opacity-50',
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />
        {image && (
          <div className="p-2">
            <div className="relative size-15.5 flex items-center justify-center group/image">
              <Hint
                label="Remove image"
                showArrow={false}
                disabled={disabled}
                // placement="top left"
                onPress={() => {
                  setImage(null)
                  if (imageElementRef.current) {
                    imageElementRef.current.value = ''
                  }
                }}
                className="mb-8 ml-15"
              >
                <div className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center cursor-pointer">
                  <IconX className="size-3.5" />
                </div>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill={true}
                priority={true}
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}
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
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <div className="bg-transparent hover:bg-neutral-300/60 outline-none border-none font-semibold text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-300/60 data-pressed:bg-neutral-300/60 size-9 shrink-0 rounded-md cursor-pointer">
              <IconMoodSmile stroke={2} />
            </div>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint
              label="Image"
              showArrow={false}
              disabled={disabled}
              onPress={() => imageElementRef.current?.click()}
            >
              <div className="bg-transparent hover:bg-neutral-300/60 outline-none border-none font-semibold text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-300/60 data-pressed:bg-neutral-300/60 size-9 shrink-0 rounded-md cursor-pointer">
                <IconPhoto stroke={2} />
              </div>
            </Hint>
          )}

          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                intent="outline"
                size="small"
                isDisabled={disabled}
                onPress={onCancel}
              >
                Cancel
              </Button>
              <Button
                isDisabled={disabled || isEmpty}
                size="small"
                onPress={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }}
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
              onPress={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                })
              }}
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
