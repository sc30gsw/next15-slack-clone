import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferRequestType, InferResponseType } from 'hono'
import 'server-only'
import { getChannelsCacheKey } from '@/constants/cache-keys'
import { unstable_cacheTag as cacheTag } from 'next/cache'

export const getChannels = async (
  req: InferRequestType<(typeof client.api.channels)[':workspaceId']['$get']> &
    Partial<Record<'userId', string>>,
) => {
  'use cache'
  cacheTag(`${getChannelsCacheKey}/${req.param.workspaceId}`)

  const url = client.api.channels[':workspaceId'].$url({ param: req.param })
  type ResType = InferResponseType<
    (typeof client.api.channels)[':workspaceId']['$get'],
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: req.userId ?? '',
    },
  })

  return res.channels
}
