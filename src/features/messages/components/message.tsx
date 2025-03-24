import { Avatar } from '@/components/justd/ui'
import { Hint } from '@/components/ui/hint'
import { Renderer } from '@/components/ui/renderer'
import { Thumbnail } from '@/features/messages/components/thumbnail'
import { formatFullTime } from '@/lib/date'
import type { client } from '@/lib/rpc'
import { format } from 'date-fns'
import type { InferResponseType } from 'hono'

type MessageAuthor = InferResponseType<
  (typeof client.api.messages)[':channelId']['$get'],
  200
>['messages'][number]['user']

type MessageMember = InferResponseType<
  (typeof client.api.messages)[':channelId']['$get'],
  200
>['messages'][number]['member']

type MessageProps = Pick<
  InferResponseType<
    (typeof client.api.messages)[':channelId']['$get'],
    200
  >['messages'][number],
  'id' | 'body' | 'image' | 'createdAt' | 'updatedAt' | 'threads' | 'reactions'
> & {
  memberId: MessageMember['userId']
  authorImage: MessageAuthor['image']
  authorName: MessageAuthor['name']
  threadCount: number
  isCompact?: boolean
}

export const Message = ({
  id,
  body,
  image,
  createdAt,
  updatedAt,
  threads,
  threadCount,
  reactions,
  memberId,
  authorImage,
  authorName = 'Member',
  isCompact,
}: MessageProps) => {
  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))} showArrow={false}>
            <div className="text-xs text-muted-fg opacity-0 group-hover:opacity-100 w-10 leading-5.5 text-center hover:underline">
              {format(new Date(createdAt), 'hh:mm')}
            </div>
          </Hint>
          <div className="flex flex-col w-full">
            <Renderer value={body} />
            {updatedAt ? (
              <span className="text-xs text-muted-fg">compact</span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
      <div className="flex items-start gap-2">
        <button type="button" className="cursor-pointer">
          <Avatar
            alt={authorName ?? 'Member'}
            size="small"
            shape="square"
            src={authorImage}
            initials={authorName?.charAt(0).toUpperCase()}
            className="bg-sky-500 text-white"
          />
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-sm">
            <button
              type="button"
              className="font-bold  hover:underline cursor-pointer"
            >
              {authorName}
            </button>
            <span>&nbsp;&nbsp;</span>
            <Hint label={formatFullTime(new Date(createdAt))} showArrow={false}>
              <div className="text-sm text-muted-fg hover:underline">
                {format(new Date(createdAt), 'h:mm a')}
              </div>
            </Hint>
          </div>
          <Renderer value={body} />
          <Thumbnail url={image} />
          {updatedAt ? (
            <span className="text-xs text-muted-fg">edited</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
