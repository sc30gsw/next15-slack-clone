import { EmojiPopover } from '@/components/ui/emoji-popover'
import { Hint } from '@/components/ui/hint'

import { IconMoodSmile, IconPencil } from '@tabler/icons-react'
import { IconMessageDots, IconTrashEmpty } from 'justd-icons'

type MessageToolbarProps = {
  isAuthor: boolean
  isPending: boolean
  handleEdit: () => void
  handleDelete: () => void
  // handleThread: () => void
  handleReaction: (value: string) => void
  hideThreadButton?: boolean
}

export const MessageToolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  // handleThread,
  handleReaction,
  hideThreadButton,
}: MessageToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          disabled={isPending}
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <div className="bg-transparent hover:bg-neutral-300/60 outline-none border-none font-semibold text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-300/60 data-pressed:bg-neutral-300/60 shrink-0 rounded-md cursor-pointer">
            <IconMoodSmile className="size-4" stroke={2} />
          </div>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread" showArrow={false} disabled={isPending}>
            <div className="bg-transparent hover:bg-neutral-300/60 outline-none border-none font-semibold text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-300/60 data-pressed:bg-neutral-300/60shrink-0 rounded-md cursor-pointer">
              <IconMessageDots className="size-4" />
            </div>
          </Hint>
        )}
        {isAuthor && (
          <Hint
            label="Edit message"
            showArrow={false}
            disabled={isPending}
            onPress={handleEdit}
          >
            <div className="bg-transparent hover:bg-neutral-300/60 outline-none border-none font-semibold text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-300/60 data-pressed:bg-neutral-300/60 shrink-0 rounded-md cursor-pointer">
              <IconPencil className="size-4" stroke={2} />
            </div>
          </Hint>
        )}
        {isAuthor && (
          <Hint
            label="Delete message"
            showArrow={false}
            disabled={isPending}
            onPress={handleDelete}
          >
            <div className="bg-transparent hover:bg-neutral-300/60 outline-none border-none font-semibold text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-300/60 data-pressed:bg-neutral-300/60 shrink-0 rounded-md cursor-pointer">
              <IconTrashEmpty className="size-4" />
            </div>
          </Hint>
        )}
      </div>
    </div>
  )
}
