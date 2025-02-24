import { getWorkspaceMembersCacheKey } from '@/constants/cache-keys'
import { getSession } from '@/lib/auth/session'
import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferRequestType, InferResponseType } from 'hono'
import 'server-only'

export const getWorkspaceMembers = async (
  req: InferRequestType<(typeof client.api.members)[':workspaceId']['$get']>,
) => {
  const url = client.api.members[':workspaceId'].$url({ param: req.param })
  type ResType = InferResponseType<
    (typeof client.api.members)[':workspaceId']['$get'],
    200
  >

  const session = await getSession()

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
