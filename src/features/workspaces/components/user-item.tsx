'use client'

import { Avatar, Button } from '@/components/justd/ui'
import type { SelectUser } from '@/db/schema'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { type VariantProps, tv } from 'tailwind-variants'

const userItemStyle = tv({
  base: 'relative',
  slots: {
    link: 'flex items-center gap-1.5 font-normal h-7 px-4 text-sm overflow-hidden absolute left-0',
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

type UserItemProps = Partial<Pick<SelectUser, 'id' | 'image'>> & {
  label?: string | null
} & VariantProps<typeof userItemStyle>

export const UserItem = ({ id, image, label, variant }: UserItemProps) => {
  const { base, link } = userItemStyle({ variant })
  const params = useParams<Record<'workspaceId', string>>()

  return (
    <Button intent="plain" size="medium" className={base()}>
      <Link
        href={`/workspace/${params.workspaceId}/member/${id}`}
        className={link()}
      >
        <Avatar
          src={image}
          alt={label ?? 'member'}
          initials={label?.charAt(0).toUpperCase()}
          shape="square"
          size="small"
          className="rounded-md mr-4 border-none outline-none bg-sky-500 text-white text-sm"
        />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  )
}
