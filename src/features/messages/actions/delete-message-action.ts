'use server'

import { getChannelMessagesCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { members, messages } from '@/db/schema'

import { getSession } from '@/lib/auth/session'
import type { SubmissionResult } from '@conform-to/react'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export const deleteMessageAction = async (
  messageId: string,
  workspaceId: string,
) => {
  const session = await getSession()

  if (!session?.user?.id) {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    } as const satisfies SubmissionResult
  }

  const message = await db.query.messages.findFirst({
    where: eq(messages.id, messageId),
  })

  const member = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, workspaceId),
      eq(members.userId, session.user.id),
    ),
  })

  if (!member || message?.userId !== member.userId) {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    } as const satisfies SubmissionResult
  }

  await db.delete(messages).where(eq(messages.id, messageId))

  revalidateTag(`${getChannelMessagesCacheKey}/${message.channelId}`)

  return {
    status: 'success',
    initialValue: {
      id: messageId,
    },
  } as const satisfies SubmissionResult
}
