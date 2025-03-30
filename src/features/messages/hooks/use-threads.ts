import { MESSAGE_LIMIT } from '@/constants'
import { getThreadsCacheKey } from '@/constants/cache-keys'
import { getThreads } from '@/features/messages/server/fetcher'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useThreads = (parentMessageId: string | null, userId?: string) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: [getThreadsCacheKey, parentMessageId],
    queryFn: async ({ pageParam = 0 }) => {
      return await getThreads(
        {
          param: { messageId: parentMessageId ?? '' },
          userId,
        },
        pageParam,
      )
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === MESSAGE_LIMIT
        ? allPages.length * MESSAGE_LIMIT
        : undefined
    },
    initialPageParam: 0,
  })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } as const
}
