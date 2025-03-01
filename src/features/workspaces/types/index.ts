import type { client } from '@/lib/rpc'
import type { InferResponseType } from 'hono'

export type Workspaces = InferResponseType<
  typeof client.api.workspaces.$get,
  200
>

export type Workspace = InferResponseType<
  (typeof client.api.workspaces)[':id']['$get'],
  200
>
