import { MESSAGE_LIMIT } from '@/constants'
import { db } from '@/db/db'
import { type SelectReaction, messages } from '@/db/schema'
import { sessionMiddleware } from '@/lib/auth/session-middleware'
import { count, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { map, pipe, reduce } from 'remeda'

const app = new Hono()
  .get('/channel/:channelId', sessionMiddleware, async (c) => {
    const { offset } = c.req.query()
    const channelId = c.req.param('channelId')

    const messageList = await db.query.messages.findMany({
      where: eq(messages.channelId, channelId),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      limit: MESSAGE_LIMIT,
      offset: Number(offset),
      with: {
        reactions: true,
        member: true,
        user: true,
      },
    })

    if (messageList.length === 0) {
      return c.json({ messages: [] }, 200)
    }

    const messagesWithThreads = await Promise.all(
      messageList.map(async (message) => {
        const threadCount = await db
          .select({ count: count() })
          .from(messages)
          .where(eq(messages.parentMessageId, message.id))

        const firstThread = await db.query.messages.findFirst({
          where: eq(messages.parentMessageId, message.id),
          with: {
            user: true,
          },
        })

        return {
          ...message,
          threadCount,
          firstThread,
        }
      }),
    )

    const messagesWithReaction = pipe(
      messagesWithThreads,
      map((message) => {
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
              const existingReaction = acc.find(
                (r) => r.value === reaction.value,
              )

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
            [] as Array<
              SelectReaction & { count: number; memberIds: string[] }
            >,
          ),
        )

        return {
          ...message,
          reactions: reactionsWithMemberIds,
        }
      }),
    )

    return c.json({ messages: messagesWithReaction }, 200)
  })
  .get('/:messageId', sessionMiddleware, async (c) => {
    const messageId = c.req.param('messageId')

    const message = await db.query.messages.findFirst({
      where: eq(messages.id, messageId),
      with: {
        reactions: true,
        member: true,
        user: true,
      },
    })

    if (!message) {
      return c.json({ message: null }, 207)
    }

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

    return c.json(
      { message: { ...message, reactions: reactionsWithMemberIds } },
      200,
    )
  })
  .get('/threads/:messageId', sessionMiddleware, async (c) => {
    const messageId = c.req.param('messageId')

    const message = await db.query.messages.findFirst({
      where: eq(messages.id, messageId),
      columns: {
        id: true,
      },
    })

    if (!message) {
      return c.json({ error: { message: 'message not found' } }, 404)
    }

    const { offset } = c.req.query()

    const threads = await db.query.messages.findMany({
      where: eq(messages.parentMessageId, messageId),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      limit: MESSAGE_LIMIT,
      offset: Number(offset),
      with: {
        user: true,
        reactions: true,
        member: true,
      },
    })

    const threadsWithChildThreads = await Promise.all(
      threads.map(async (thread) => {
        const threadCount = await db
          .select({ count: count() })
          .from(messages)
          .where(eq(messages.parentMessageId, thread.id))

        const firstThread = await db.query.messages.findFirst({
          where: eq(messages.parentMessageId, message.id),
          with: {
            user: true,
          },
        })

        return {
          ...thread,
          threadCount,
          firstThread,
        }
      }),
    )

    const threadsWithReaction = threadsWithChildThreads.map((thread) => {
      const reactions = thread.reactions
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
        ...thread,
        reactions: reactionsWithMemberIds,
      }
    })

    return c.json({ threads: threadsWithReaction }, 200)
  })
  .get('/conversations/:conversationId', sessionMiddleware, async (c) => {
    const { offset } = c.req.query()
    const conversationId = c.req.param('conversationId')

    const messageList = await db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      limit: MESSAGE_LIMIT,
      offset: Number(offset),
      with: {
        reactions: true,
        member: true,
        user: true,
      },
    })

    if (messageList.length === 0) {
      return c.json({ messages: [] }, 200)
    }

    const messagesWithThreads = await Promise.all(
      messageList.map(async (message) => {
        const threadCount = await db
          .select({ count: count() })
          .from(messages)
          .where(eq(messages.parentMessageId, message.id))

        const firstThread = await db.query.messages.findFirst({
          where: eq(messages.parentMessageId, message.id),
          with: {
            user: true,
          },
        })

        return {
          ...message,
          threadCount,
          firstThread,
        }
      }),
    )

    const messagesWithReaction = pipe(
      messagesWithThreads,
      map((message) => {
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
              const existingReaction = acc.find(
                (r) => r.value === reaction.value,
              )

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
            [] as Array<
              SelectReaction & { count: number; memberIds: string[] }
            >,
          ),
        )

        return {
          ...message,
          reactions: reactionsWithMemberIds,
        }
      }),
    )

    return c.json({ messages: messagesWithReaction }, 200)
  })

export default app
