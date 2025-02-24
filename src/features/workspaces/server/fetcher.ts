import 'server-only'
import { getWorkspacesCacheKey } from '@/constants/cache-keys'
import type { Workspace, Workspaces } from '@/features/workspaces/types'
import { getSession } from '@/lib/auth/session'
import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferRequestType } from 'hono'

export const getWorkspaces = async () => {
  const url = client.api.workspaces.$url()

  const session = await getSession()

  const res = await fetcher<Workspaces>(url, {
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
  const url = client.api.workspaces[':id'].$url({ param: req.param })

  const session = await getSession()

  const res = await fetcher<Workspace>(url, {
    headers: {
      // biome-ignore lint/style/useNamingConvention: this is a protected api
      Authorization: session?.user?.id ?? '',
    },
    cache: 'force-cache',
    next: { tags: [`${getWorkspacesCacheKey}/${req.param.id}`] },
  })

  return res
}
