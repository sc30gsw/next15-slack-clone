import { db } from '@/db/db'
import { Hono } from 'hono'

const app = new Hono().get('/', async (c) => {
  const workspaces = await db.query.workspaces.findMany()

  return c.json(workspaces)
})

export default app
