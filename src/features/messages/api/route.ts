import { MESSAGE_LIMIT } from '@/constants'
import { db } from '@/db/db'
import { type SelectReaction, messages } from '@/db/schema'
import { sessionMiddleware } from '@/lib/auth/session-middleware'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { map, pipe, reduce } from 'remeda'

const app = new Hono().get('/:channelId', sessionMiddleware, async (c) => {
  const { offset } = c.req.query()
  const channelId = c.req.param('channelId')

  const messageList = await db.query.messages.findMany({
    where: eq(messages.channelId, channelId),
    orderBy: (messages, { asc }) => [asc(messages.createdAt)],
    limit: MESSAGE_LIMIT,
    offset: Number(offset),
    with: {
      threads: {
        with: {
          user: true,
        },
      },
      reactions: true,
      member: true,
      user: true,
    },
  })

  const messagesWithReaction = messageList.map((message) => {
    const reactions = message.reactions
    const reactionsWithMemberIds = pipe(
      reactions,
      map((reaction) => {
        return {
          ...reaction,
          count: reactions.filter((r) => r.value === reaction.value).length,
        }
      }),
      reduce(
        (acc, reaction) => {
          const existingReaction = acc.find((r) => r.value === reaction.value)

          if (existingReaction) {
            existingReaction.memberIds = Array.from(
              new Set([...existingReaction.memberIds, reaction.userId]),
            )
          } else {
            acc.push({
              ...reaction,
              memberIds: [reaction.userId],
            })
          }

          return acc
        },
        [] as Array<SelectReaction & { count: number; memberIds: string[] }>,
      ),
    )

    return {
      ...message,
      reactions: reactionsWithMemberIds,
    }
  })

  return c.json({ messages: messagesWithReaction }, 200)
})

export default app
