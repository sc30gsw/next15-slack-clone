import 'server-only'
import { getWorkspacesCacheKey } from '@/features/workspaces/constants/cache-keys'
import { getSession } from '@/lib/auth/session'
import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferResponseType } from 'hono'

export const getWorkspace = async (workspaceId: string) => {
  type ResType = InferResponseType<
    (typeof client.api.workspaces)[':id']['$get'],
    200
  >
  const url = client.api.workspaces[':id'].$url({ param: { id: workspaceId } })

  const session = await getSession()

  const res = await fetcher<ResType>(url, {
    headers: {
      // biome-ignore lint/style/useNamingConvention: this is a protected api
      Authorization: session?.user?.id ?? '',
    },
    cache: 'force-cache',
    next: { tags: [`${getWorkspacesCacheKey}/${workspaceId}`] },
  })

  return res
}
