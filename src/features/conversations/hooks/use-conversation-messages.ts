import { MESSAGE_LIMIT } from '@/constants'
import { getConversationMessagesCacheKey } from '@/constants/cache-keys'
import { getConversationMessages } from '@/features/messages/server/fetcher'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useConversationMessages = (
  conversationId: string,
  userId?: string,
) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [getConversationMessagesCacheKey, conversationId],
      queryFn: async ({ pageParam = 0 }) => {
        return await getConversationMessages(
          {
            param: { conversationId },
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
