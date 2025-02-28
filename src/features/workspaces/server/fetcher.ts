import 'server-only'
import { getWorkspacesCacheKey } from '@/constants/cache-keys'
import type { Workspace, Workspaces } from '@/features/workspaces/types'
import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferRequestType } from 'hono'
import { unstable_cacheTag as cacheTag } from 'next/cache'

export const getWorkspaces = async (userId?: string) => {
  'use cache'
  cacheTag(getWorkspacesCacheKey)

  const url = client.api.workspaces.$url()

  const res = await fetcher<Workspaces>(url, {
    headers: {
      // biome-ignore lint/style/useNamingConvention: this is a protected api
      Authorization: userId ?? '',
    },
  })

  return res
}

export const getWorkspace = async (
  req: InferRequestType<(typeof client.api.workspaces)[':id']['$get']> &
    Partial<Record<'userId', string>>,
) => {
  'use cache'
  cacheTag(`${getWorkspacesCacheKey}/${req.param.id}`)

  const url = client.api.workspaces[':id'].$url({ param: req.param })

  const res = await fetcher<Workspace>(url, {
    headers: {
      // biome-ignore lint/style/useNamingConvention: this is a protected api
      Authorization: req.userId ?? '',
    },
  })

  return res
}
