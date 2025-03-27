'use server'

import { getChannelMessagesCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { members, messages, reactions } from '@/db/schema'
import {
  type ToggleReactionInput,
  toggleReactionInputSchema,
} from '@/features/reactions/types/schemas/toggle-reaction-input-schema'
import { getSession } from '@/lib/auth/session'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export const toggleReactionAction = async (data: ToggleReactionInput) => {
  const result = toggleReactionInputSchema.safeParse(data)

  if (!result.success) {
    return {
      status: 'error',
      error: {
        message: result.error.errors,
      },
    }
  }

  const session = await getSession()

  if (!session?.user?.id) {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    }
  }

  const message = await db.query.messages.findFirst({
    where: eq(messages.id, result.data.messageId),
  })

  if (!message) {
    return {
      status: 'error',
      error: {
        message: ['message not found'],
      },
    }
  }

  const member = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, message.workspaceId),
      eq(members.userId, session.user.id),
    ),
  })

  if (!member) {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    }
  }

  const existingMessageReactionFromUser = await db.query.reactions.findFirst({
    where: and(
      eq(reactions.messageId, message.id),
      eq(reactions.userId, session.user.id),
      eq(reactions.value, result.data.value),
    ),
  })

  if (existingMessageReactionFromUser) {
    await db
      .delete(reactions)
      .where(eq(reactions.id, existingMessageReactionFromUser.id))

    revalidateTag(`${getChannelMessagesCacheKey}/${message.channelId}`)

    return {
      status: 'success',
      initialValue: {
        reactionId: existingMessageReactionFromUser.id,
      },
    }
  }

  const [newReactionId] = await db
    .insert(reactions)
    .values({
      workspaceId: message.workspaceId,
      messageId: message.id,
      userId: session.user.id,
      value: result.data.value,
    })
    .returning({ id: reactions.id })

  revalidateTag(`${getChannelMessagesCacheKey}/${message.channelId}`)

  return {
    status: 'success',
    initialValue: {
      reactionId: newReactionId.id,
    },
  }
}
