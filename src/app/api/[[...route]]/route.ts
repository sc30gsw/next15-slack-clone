import tasks from '@/features/tasks/api/route'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

// basePath は API ルートのベースパスを指定します
// 以降、新たに生やす API ルートはこのパスを基準に追加されます
const app = new Hono().basePath('/api')
const route = app.route('/tasks', tasks)

export type AppType = typeof route

export const GET = handle(app)
export const POST = handle(app)
