import { db } from '@/db/db'
import { Hono } from 'hono'

const app = new Hono().get('/', async (c) => {
  const tasks = await db.query.tasksTable.findMany()

  return c.json(tasks)
})

export default app
