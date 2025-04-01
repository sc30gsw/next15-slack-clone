import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferResponseType } from 'hono'
import 'server-only'
import { getConversationCacheKey } from '@/constants/cache-keys'
import { unstable_cacheTag as cacheTag } from 'next/cache'

export const getConversation = async (
  query: Record<'workspaceId' | 'memberTwoId', string>,
  userId?: string,
) => {
  'use cache'
  cacheTag(
    `${getConversationCacheKey}/${query.workspaceId}/${query.memberTwoId}`,
  )

  const url = client.api.conversations.current.$url()
  url.searchParams.set('workspaceId', query.workspaceId)
  url.searchParams.set('memberTwoId', query.memberTwoId)
  type ResType = InferResponseType<
    typeof client.api.conversations.current.$get,
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: userId ?? '',
    },
  })

  return { conversation: res.conversation, member: res.otherUser } as const
}
