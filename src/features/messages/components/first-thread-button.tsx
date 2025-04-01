import { Avatar } from '@/components/justd/ui'
import { usePanel } from '@/features/messages/hooks/use-panel'
import type { MessageResponse } from '@/features/messages/types'
import type { client } from '@/lib/rpc'
import { formatDistanceToNow } from 'date-fns'
import type { InferResponseType } from 'hono'
import { IconChevronRight } from 'justd-icons'

type FirstThread = Exclude<
  InferResponseType<
    (typeof client.api.messages.channel)[':channelId']['$get'],
    200
  >['messages'][number]['firstThread'],
  undefined
>

type FirstThreadButtonProps = Pick<MessageResponse, 'id'> & {
  name: FirstThread['user']['name']
  image: FirstThread['user']['image']
  threadCount: number
  createdAt: FirstThread['createdAt']
}

export const FirstThreadButton = ({
  id,
  image,
  name,
  threadCount,
  createdAt,
}: FirstThreadButtonProps) => {
  const { onOpenMessage } = usePanel()

  return (
    <button
      type="button"
      className="p-1 flex items-center justify-between text-sm group cursor-pointer hover:border rounded-md transition-colors duration-200 w-55"
      onClick={() => onOpenMessage(id)}
    >
      <div className="flex items-center gap-x-2">
        <Avatar
          size="small"
          shape="square"
          src={image}
          alt={name ?? 'Member'}
          initials={name?.charAt(0).toUpperCase()}
          className="bg-sky-500 text-white"
        />
        <span className="font-bold text-primary group-hover:underline transition-colors duration-200">
          {threadCount} reply
        </span>

        <div className="text-gray-500">
          <span className="block group-hover:hidden">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
            })}
          </span>
          <span className="hidden group-hover:flex items-center">
            View threads
          </span>
        </div>
      </div>
      <IconChevronRight className="size-5 hidden group-hover:block" />
    </button>
  )
}
