import { db } from '@/db/db'
import { workspaces } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/:id', async (c) => {
  const { id } = c.req.param()

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, id),
  })

  if (!workspace) {
    return c.json({ error: { message: 'Workspace not found' } }, 404)
  }

  return c.json(workspace, 200)
})

export default app
