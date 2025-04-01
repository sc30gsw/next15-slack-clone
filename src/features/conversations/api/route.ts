import { db } from '@/db/db'
import { conversations, users } from '@/db/schema'
import { sessionMiddleware } from '@/lib/auth/session-middleware'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/current', sessionMiddleware, async (c) => {
  const { workspaceId, memberTwoId } = c.req.query()

  if (!(workspaceId && memberTwoId)) {
    return c.json({ error: 'Missing required parameters' }, 400)
  }

  const user = c.get('user')

  const conversation = await db.query.conversations.findFirst({
    where: and(
      eq(conversations.workspaceId, workspaceId),
      // memberOne is the current user
      eq(conversations.memberOneId, user.id),
      // memberTwo is the other user
      eq(conversations.memberTwoId, memberTwoId),
    ),
  })

  if (!conversation) {
    return c.json({ error: 'Conversation not found' }, 404)
  }

  const otherUser = await db.query.users.findFirst({
    where: eq(users.id, conversation.memberTwoId),
  })

  if (!otherUser) {
    return c.json({ error: 'Other user not found' }, 404)
  }

  return c.json({ conversation, otherUser }, 200)
})

export default app
