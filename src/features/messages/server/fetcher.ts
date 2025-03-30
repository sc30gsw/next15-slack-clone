import { fetcher } from '@/lib/fetcher'
import { client } from '@/lib/rpc'
import type { InferRequestType, InferResponseType } from 'hono'

export const getChannelMessages = async (
  req: InferRequestType<
    (typeof client.api.messages.channel)[':channelId']['$get']
  > &
    Partial<Record<'userId', string>>,
  offset: number,
) => {
  const url = client.api.messages.channel[':channelId'].$url({
    param: req.param,
  })
  url.searchParams.set('offset', offset.toString())
  type ResType = InferResponseType<
    (typeof client.api.messages.channel)[':channelId']['$get'],
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: req.userId ?? '',
    },
  })

  return res.messages
}

export const getMessage = async (
  req: InferRequestType<(typeof client.api.messages)[':messageId']['$get']> &
    Partial<Record<'userId', string>>,
) => {
  const url = client.api.messages[':messageId'].$url({ param: req.param })
  type ResType = InferResponseType<
    (typeof client.api.messages)[':messageId']['$get'],
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: req.userId ?? '',
    },
  })

  return res.message
}

export const getThreads = async (
  req: InferRequestType<
    (typeof client.api.messages.threads)[':messageId']['$get']
  > &
    Partial<Record<'userId', string>>,
  offset: number,
) => {
  const url = client.api.messages.threads[':messageId'].$url({
    param: req.param,
  })
  url.searchParams.set('offset', offset.toString())
  type ResType = InferResponseType<
    (typeof client.api.messages.threads)[':messageId']['$get'],
    200
  >

  const res = await fetcher<ResType>(url, {
    headers: {
      Authorization: req.userId ?? '',
    },
  })

  return res.threads
}
