import { Avatar } from '@/components/justd/ui'
import { formatDistanceToNow } from 'date-fns'
import { IconChevronRight } from 'justd-icons'

type ThreadBarProps = {
  count?: number
  image?: string
  name?: string
  timestamp?: string
  onClick?: () => void
}

export const ThreadBar = ({
  count,
  image,
  name = 'Member',
  timestamp,
  onClick,
}: ThreadBarProps) => {
  if (!(count && timestamp)) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-150 cursor-pointer"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar
          alt={name}
          shape="square"
          size="small"
          src={image}
          initials={name?.charAt(0).toUpperCase()}
          className="bg-sky-500 text-white shrink-0"
        />
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? 'replies' : 'reply'}
        </span>
        <span className="text-xs text-muted-fg truncate group-hover/thread-bar:hidden block">
          Last reply{' '}
          {formatDistanceToNow(timestamp, {
            addSuffix: true,
          })}
        </span>
        <span className="text-xs text-muted-fg truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
      <IconChevronRight className="size-4 text-muted-fg ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
    </button>
  )
}
