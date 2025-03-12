import { getWorkspaceInfoCacheKey } from '@/constants/cache-keys'
import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferRequestType, InferResponseType } from 'hono'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import 'server-only'

export const getWorkspaceInfo = async (
  req: InferRequestType<(typeof client.api.join.workspace)[':id']['$get']> &
    Partial<Record<'userId', string>>,
) => {
  'use cache'
  cacheTag(`${getWorkspaceInfoCacheKey}/${req.param.id}`)

  const url = client.api.join.workspace[':id'].$url(req)
  type ResType = InferResponseType<
    (typeof client.api.join.workspace)[':id']['$get'],
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: req.userId ?? '',
    },
  })

  return res
}
