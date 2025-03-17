import { db } from '@/db/db'
import { channels, members } from '@/db/schema'
import { sessionMiddleware } from '@/lib/auth/session-middleware'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono()
  .get('/:workspaceId', sessionMiddleware, async (c) => {
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
      orderBy: (channels, { asc }) => [asc(channels.name)],
    })

    return c.json({ channels: channelList }, 200)
  })
  .get('/:workspaceId/:channelId', sessionMiddleware, async (c) => {
    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, c.req.param('channelId')),
    })

    if (!channel) {
      return c.json({ error: { message: 'Channel not found' } }, 404)
    }

    const member = await db.query.members.findFirst({
      where: and(
        eq(members.workspaceId, c.req.param('workspaceId')),
        eq(members.userId, c.get('user').id),
      ),
    })

    if (!member) {
      return c.json({ error: { message: 'Forbidden' } }, 403)
    }

    return c.json({ channel }, 200)
  })

export default app
