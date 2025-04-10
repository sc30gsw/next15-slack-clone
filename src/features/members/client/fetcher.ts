import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferRequestType, InferResponseType } from 'hono'

export const getMember = async (
  req: InferRequestType<
    (typeof client.api.members)['workspace-member'][':workspaceId'][':memberId']['$get']
  > &
    Partial<Record<'userId', string>>,
) => {
  const url = client.api.members['workspace-member'][':workspaceId'][
    ':memberId'
  ].$url({
    param: req.param,
  })
  type ResType = InferResponseType<
    (typeof client.api.members)['workspace-member'][':workspaceId'][':memberId']['$get'],
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: req.userId ?? '',
    },
  })

  return res.member
}
