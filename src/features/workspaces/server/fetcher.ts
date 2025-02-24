import 'server-only'
import {
  getWorkspaceMembersCacheKey,
  getWorkspacesCacheKey,
} from '@/constants/cache-keys'
import { getSession } from '@/lib/auth/session'
import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferRequestType, InferResponseType } from 'hono'

export const getWorkspaces = async () => {
  type ResType = InferResponseType<typeof client.api.workspaces.$get, 200>
  const url = client.api.workspaces.$url()

  const session = await getSession()

  const res = await fetcher<ResType>(url, {
    headers: {
      // biome-ignore lint/style/useNamingConvention: this is a protected api
      Authorization: session?.user?.id ?? '',
    },
    cache: 'force-cache',
    next: { tags: [getWorkspacesCacheKey] },
  })

  return res
}

export const getWorkspace = async (
  req: InferRequestType<(typeof client.api.workspaces)[':id']['$get']>,
) => {
  type ResType = InferResponseType<
    (typeof client.api.workspaces)[':id']['$get'],
    200
  >
  const url = client.api.workspaces[':id'].$url({ param: req.param })

  const session = await getSession()

  const res = await fetcher<ResType>(url, {
    headers: {
      // biome-ignore lint/style/useNamingConvention: this is a protected api
      Authorization: session?.user?.id ?? '',
    },
    cache: 'force-cache',
    next: { tags: [`${getWorkspacesCacheKey}/${req.param.id}`] },
  })

  return res
}

export const getWorkspaceMembers = async (
  req: InferRequestType<(typeof client.api.members)[':workspaceId']['$get']>,
) => {
  const session = await getSession()

  const url = client.api.members[':workspaceId'].$url({ param: req.param })
  type ResType = InferResponseType<
    (typeof client.api.members)[':workspaceId']['$get'],
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      // biome-ignore lint/style/useNamingConvention: this is a protected api
      Authorization: session?.user?.id ?? '',
    },
    cache: 'force-cache',
    next: {
      tags: [`${getWorkspaceMembersCacheKey}/${req.param.workspaceId}`],
    },
  })

  return res
}
