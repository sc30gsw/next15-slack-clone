'use client'

import { Button } from '@/components/justd/ui'
import { cn } from '@/utils/classes'
import { usePathname } from 'next/navigation'
import type { JSX } from 'react'

type SidebarButtonProps = {
  icon: JSX.Element
  label: string
}

export const SidebarButton = ({ icon, label }: SidebarButtonProps) => {
  const pathname = usePathname()

  const getIsActive = () => {
    switch (label) {
      case 'Home':
        return pathname.includes('/workspace')
      case 'DMs':
        return pathname === '/mentions'
      case 'Activity':
        return pathname === '/saved'
      case 'More':
        return pathname === '/more'
      default:
        return false
    }
  }
  return (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      <Button
        intent="secondary"
        appearance="outline"
        size="square-petite"
        className={cn(
          'size-9 p-2 text-white bg-transparent group-hover:bg-neutral-200/60 data-hovered:bg-neutral-200/60 data-pressed:bg-neutral-200/60 outline-none border-none',
          getIsActive() && 'bg-neutral-200/40',
        )}
      >
        {icon}
      </Button>
      <span className="text-[11px] text-white group-hover:text-neutral-200">
        {label}
      </span>
    </div>
  )
}
