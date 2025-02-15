import 'server-only'
import { getWorkspacesCacheKey } from '@/features/workspaces/constants/cache-keys'
import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferResponseType } from 'hono'

export const getWorkspace = async (workspaceId: string) => {
  type ResType = InferResponseType<
    (typeof client.api.workspaces)[':id']['$get'],
    200
  >
  const url = client.api.workspaces[':id'].$url({ param: { id: workspaceId } })

  const res = await fetcher<ResType>(url, {
    cache: 'force-cache',
    next: { tags: [`${getWorkspacesCacheKey}/${workspaceId}`] },
  })

  return res
}
