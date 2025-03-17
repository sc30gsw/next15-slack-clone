import {
  getWorkspaceCurrentMemberCacheKey,
  getWorkspaceMembersCacheKey,
} from '@/constants/cache-keys'
import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferRequestType, InferResponseType } from 'hono'
import 'server-only'
import { unstable_cacheTag as cacheTag } from 'next/cache'

export const getWorkspaceCurrentMember = async (
  req: InferRequestType<
    (typeof client.api.members)[':workspaceId']['current-member']['$get']
  > &
    Partial<Record<'userId', string>>,
) => {
  'use cache'
  cacheTag(`${getWorkspaceCurrentMemberCacheKey}/${req.param.workspaceId}`)

  const url = client.api.members[':workspaceId']['current-member'].$url({
    param: req.param,
  })
  type ResType = InferResponseType<
    (typeof client.api.members)[':workspaceId']['current-member']['$get'],
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: req.userId ?? '',
    },
  })

  return res.member
}

export const getWorkspaceMembers = async (
  req: InferRequestType<(typeof client.api.members)[':workspaceId']['$get']> &
    Partial<Record<'userId', string>>,
) => {
  'use cache'
  cacheTag(`${getWorkspaceMembersCacheKey}/${req.param.workspaceId}`)

  const url = client.api.members[':workspaceId'].$url({
    param: req.param,
  })
  type ResType = InferResponseType<
    (typeof client.api.members)[':workspaceId']['$get'],
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: req.userId ?? '',
    },
  })

  return res.members
}
