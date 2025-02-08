import tasks from '@/features/tasks/api/route'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')
const route = app.route('/tasks', tasks)

export type AppType = typeof route

export const GET = handle(app)
export const POST = handle(app)
