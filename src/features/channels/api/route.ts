import { db } from '@/db/db'
import { channels, members } from '@/db/schema'
import { sessionMiddleware } from '@/lib/auth/session-middleware'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/:workspaceId', sessionMiddleware, async (c) => {
  const user = c.get('user')

  const workspaceMember = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, c.req.param('workspaceId')),
      eq(members.userId, user.id),
    ),
  })

  if (!workspaceMember) {
    return c.json({ channels: [] }, 200)
  }

  const channelList = await db.query.channels.findMany({
    where: eq(channels.workspaceId, c.req.param('workspaceId')),
  })

  return c.json({ channels: channelList }, 200)
})

export default app
