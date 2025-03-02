'use client'

import { Button } from '@/components/justd/ui'
import { Hint } from '@/components/ui/hint'
import { cn } from '@/utils/classes'
import { IconCaretDownFilled } from '@tabler/icons-react'
import { IconPlus } from 'justd-icons'
import type { ReactNode } from 'react'
import { useToggle } from 'react-use'

type WorkspaceSectionProps = {
  label: string
  hint: string
  children: ReactNode
  isNew?: boolean
}

export const WorkspaceSection = ({
  label,
  hint,
  children,
  isNew,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true)

  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center justify-between pr-3.5 pl-3 group">
        <div className="flex items-center">
          <Button
            intent="transparent"
            className="p-0.5 text-sm size-6 text-[#f9edffcc] shrink-0 hover:bg-neutral-200/20 data-hovered:bg-neutral-200/20 data-pressed:bg-neutral-200/20"
            onPress={toggle}
          >
            <IconCaretDownFilled
              stroke={1}
              className={cn('size-4 transition-transform', on && '-rotate-90')}
            />
          </Button>
          <Button
            intent="transparent"
            size="small"
            className="group px-1.5 text-sm text-[#f9edffcc] h-7 justify-start items-center overflow-hidden hover:bg-neutral-200/20 data-hovered:bg-neutral-200/20 data-pressed:bg-neutral-200/20"
          >
            <span className="truncate">{label}</span>
          </Button>
        </div>

        {isNew && (
          <Hint label={hint} placement="top" showArrow={false}>
            <div className="flex items-center bg-transparent hover:bg-neutral-200/60 outline-none border-none data-hovered:bg-neutral-200/60 data-pressed:bg-neutral-200/60 rounded-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0">
              <IconPlus className="size-5" />
            </div>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  )
}
