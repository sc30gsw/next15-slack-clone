import {
  getChannelMessagesCacheKey,
  getConversationMessagesCacheKey,
} from '@/constants/cache-keys'
import type { useQueryClient } from '@tanstack/react-query'

export const reactionRevalidate = (
  target: 'messages' | 'conversation',
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
) => {
  if (target === 'messages') {
    queryClient.invalidateQueries({
      queryKey: [getChannelMessagesCacheKey, id],
    })
  } else {
    queryClient.invalidateQueries({
      queryKey: [getConversationMessagesCacheKey, id],
    })
  }
}
