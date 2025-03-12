import { db } from '@/db/db'
import { members, workspaces } from '@/db/schema'
import { sessionMiddleware } from '@/lib/auth/session-middleware'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/workspace/:id', sessionMiddleware, async (c) => {
  const user = c.get('user')

  const { id } = c.req.param()

  const memberPromise = db.query.members.findFirst({
    where: and(eq(members.workspaceId, id), eq(members.userId, user.id)),
  })

  const workspacePromise = db.query.workspaces.findFirst({
    where: eq(workspaces.id, id),
  })

  const [member, workspace] = await Promise.all([
    memberPromise,
    workspacePromise,
  ])

  if (!workspace) {
    return c.json({ error: { message: 'Workspace not found' } }, 404)
  }

  return c.json({ name: workspace.name, isMember: !!member }, 200)
})

export default app
