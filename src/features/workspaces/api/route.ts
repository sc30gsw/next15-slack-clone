import { db } from '@/db/db'
import { workspaces } from '@/db/schema'
import { sessionMiddleware } from '@/lib/auth/session-middleware'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/:id', sessionMiddleware, async (c) => {
  const user = c.get('user')

  const { id } = c.req.param()

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, id),
  })

  if (!workspace) {
    return c.json({ error: { message: 'Workspace not found' } }, 404)
  }

  if (user.id !== workspace.userId) {
    return c.json({ error: { message: 'Forbidden' } }, 403)
  }

  return c.json(workspace, 200)
})

export default app
