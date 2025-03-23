import channels from '@/features/channels/api/route'
import join from '@/features/join/api/route'
import members from '@/features/members/api/route'
import upload from '@/features/upload/api/route'
import workspaces from '@/features/workspaces/api/route'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')
const route = app
  .route('/workspaces', workspaces)
  .route('/members', members)
  .route('/channels', channels)
  .route('/join', join)
  .route('/upload', upload)

export type AppType = typeof route

export const GET = handle(app)
export const POST = handle(app)
