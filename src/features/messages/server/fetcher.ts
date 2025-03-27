import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferRequestType, InferResponseType } from 'hono'

export const getChannelMessages = async (
  req: InferRequestType<(typeof client.api.messages)[':channelId']['$get']> &
    Partial<Record<'userId', string>>,
  offset: number,
) => {
  const url = client.api.messages[':channelId'].$url({
    param: req.param,
  })
  url.searchParams.set('offset', offset.toString())
  type ResType = InferResponseType<
    (typeof client.api.messages)[':channelId']['$get'],
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: req.userId ?? '',
    },
  })

  return res.messages
}
