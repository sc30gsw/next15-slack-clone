import type { client } from '@/lib/rpc'
import type { InferResponseType } from 'hono'

export type MessageResponse = InferResponseType<
  (typeof client.api.messages.channel)[':channelId']['$get'],
  200
>['messages'][number]
