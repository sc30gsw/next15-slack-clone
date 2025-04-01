import { MESSAGE_LIMIT } from '@/constants'
import { getChannelMessagesCacheKey } from '@/constants/cache-keys'
import { getChannelMessages } from '@/features/messages/server/fetcher'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useChannelMessages = (channelId: string, userId?: string) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [getChannelMessagesCacheKey, channelId],
      queryFn: async ({ pageParam = 0 }) => {
        return await getChannelMessages(
          {
            param: { channelId },
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
  } as const
}
