import { db } from '@/db/db'
import { members } from '@/db/schema'
import { sessionMiddleware } from '@/lib/auth/session-middleware'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono()
  .get('/:workspaceId/current-member', sessionMiddleware, async (c) => {
    const user = c.get('user')

    const workspaceMember = await db.query.members.findFirst({
      where: and(
        eq(members.workspaceId, c.req.param('workspaceId')),
        eq(members.userId, user.id),
      ),
    })

    return c.json({ member: workspaceMember }, 200)
  })
  .get('/:workspaceId', sessionMiddleware, async (c) => {
    const user = c.get('user')

    const workspaceMember = await db.query.members.findFirst({
      where: and(
        eq(members.workspaceId, c.req.param('workspaceId')),
        eq(members.userId, user.id),
      ),
    })

    if (!workspaceMember) {
      return c.json({ members: [] }, 200)
    }

    const workspaceMembers = await db.query.members.findMany({
      where: eq(members.workspaceId, c.req.param('workspaceId')),
      with: { user: true },
      orderBy: (members, { desc }) => [desc(members.createdAt)],
    })

    return c.json({ members: workspaceMembers }, 200)
  })
  .get('/member/:memberId', sessionMiddleware, async (c) => {
    const member = await db.query.members.findFirst({
      where: eq(members.userId, c.req.param('memberId')),
      with: {
        user: true,
      },
    })

    if (!member) {
      return c.json({ member: null }, 200)
    }

    return c.json({ member }, 200)
  })

export default app
