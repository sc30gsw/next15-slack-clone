'use server'

import { getChannelMessagesCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { members, messages } from '@/db/schema'
import {
  type UpdateMessageInput,
  updateMessageInputSchema,
} from '@/features/messages/types/schemas/update-message-input-schema'

import { getSession } from '@/lib/auth/session'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export const updateMessageAction = async (data: UpdateMessageInput) => {
  const result = updateMessageInputSchema.safeParse(data)

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

  const messagePromise = db.query.messages.findFirst({
    where: eq(messages.id, result.data.id),
  })

  const memberPromise = db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, result.data.workspaceId),
      eq(members.userId, session.user.id),
    ),
  })

  const [member, message] = await Promise.all([memberPromise, messagePromise])

  if (!member || message?.userId !== member.userId) {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    }
  }

  await db
    .update(messages)
    .set({
      body: result.data.body,
      isUpdated: 1,
    })
    .where(eq(messages.id, result.data.id))

  revalidateTag(`${getChannelMessagesCacheKey}/${result.data.channelId}`)

  return {
    status: 'success',
    initialValue: {
      id: result.data.id,
      conversationId: message.conversationId,
    },
  }
}
