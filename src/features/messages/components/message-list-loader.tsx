import { Skeleton } from '@/components/justd/ui'

const DEFAULT_LENGTH = 5

export const MessageListLoader = ({
  length = DEFAULT_LENGTH,
}: Partial<Record<'length', number>>) => {
  return (
    <div className="flex flex-col gap-y-4 p-1.5 px-5">
      {Array.from({ length }).map(() => (
        <div key={crypto.randomUUID()}>
          <div className="flex items-start gap-2">
            <Skeleton className="size-6" />
            <Skeleton className="h-4 w-25" />
            <Skeleton className="h-4 w-14" />
          </div>
          <div className="flex flex-col gap-y-1.5 ml-8">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
