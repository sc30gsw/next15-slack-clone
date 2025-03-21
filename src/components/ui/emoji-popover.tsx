import { Popover, Tooltip } from '@/components/justd/ui'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useTheme } from 'next-themes'
import { type ReactNode, useRef, useState } from 'react'

type EmojiPopoverProps = {
  children: ReactNode
  hint?: string
  onEmojiSelect: (
    emoji: Record<'id' | 'name' | 'native' | 'shortcodes' | 'unified', string> &
      Record<'keywords', string[]>,
  ) => void
}

export const EmojiPopover = ({
  children,
  hint = 'Emoji',
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const triggerRef = useRef(null)
  const { theme } = useTheme()

  const onSelect = (
    emoji: Record<'id' | 'name' | 'native' | 'shortcodes' | 'unified', string> &
      Record<'keywords', string[]>,
  ) => {
    onEmojiSelect(emoji)
    setPopoverOpen(false)

    setTimeout(() => {
      setTooltipOpen(false)
    }, 500)
  }

  return (
    <>
      <Tooltip isOpen={tooltipOpen} onOpenChange={setTooltipOpen} delay={50}>
        <Tooltip.Trigger ref={triggerRef} onPress={() => setPopoverOpen(true)}>
          {children}
        </Tooltip.Trigger>

        <Tooltip.Content className="bg-black text-white border border-white/5">
          <p className="font-medium text-xs">{hint}</p>
        </Tooltip.Content>
      </Tooltip>
      <Popover.Content
        triggerRef={triggerRef}
        isOpen={popoverOpen}
        onOpenChange={setPopoverOpen}
        className="p-0 w-full border-none shadow-none"
      >
        <Picker
          data={data}
          theme={theme}
          onEmojiSelect={(
            emoji: Record<
              'id' | 'name' | 'native' | 'shortcodes' | 'unified',
              string
            > &
              Record<'keywords', string[]>,
          ) => onSelect(emoji)}
        />
      </Popover.Content>
    </>
  )
}
