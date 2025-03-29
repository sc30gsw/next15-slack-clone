import { getMessageCacheKey } from '@/constants/cache-keys'
import { getMessage } from '@/features/messages/server/fetcher'
import { useQuery } from '@tanstack/react-query'

export const useThreadMessage = (
  parentMessageId: string | null,
  userId?: string,
) => {
  const { isFetching, isError, data, refetch } = useQuery({
    queryKey: [`${getMessageCacheKey}/${parentMessageId}`],
    queryFn: () =>
      getMessage({ param: { messageId: parentMessageId ?? '' }, userId }),
  })

  return {
    isFetching,
    isError,
    data,
    refetch,
  } as const
}
