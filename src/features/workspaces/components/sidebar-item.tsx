import { Button } from '@/components/justd/ui'
import Link from 'next/link'
import type { FC, JSX, SVGProps } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

const sidebarItemStyle = tv({
  base: 'relative',
  slots: {
    link: 'flex items-center gap-1.5 font-normal h-7 px-[18px] text-sm overflow-hidden absolute left-0',
  },
  variants: {
    variant: {
      default: {
        base: 'hover:bg-neutral-200/20 data-hovered:bg-neutral-200/20 data-pressed:bg-neutral-200/20',
        link: 'text-[#f9edffcc]',
      },
      active: {
        base: 'bg-white/90 hover:bg-white/90 data-hovered:bg-white/90 data-pressed:bg-white/90',
        link: 'text-[#481349]',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type SidebarItemProps = {
  workspaceId: string
  id: string
  label: string
  icon?: FC<SVGProps<SVGSVGElement>>
  channelIcon?: JSX.Element
} & VariantProps<typeof sidebarItemStyle>

export const SidebarItem = ({
  workspaceId,
  id,
  label,
  icon: Icon,
  channelIcon,
  variant,
}: SidebarItemProps) => {
  const { base, link } = sidebarItemStyle({ variant })

  return (
    <Button intent="plain" size="small" className={base()}>
      <Link href={`/workspace/${workspaceId}/channel/${id}`} className={link()}>
        {Icon && <Icon className="size-3.5 mr-1 shrink-0" />}
        {channelIcon && channelIcon}
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  )
}
