'use server'

import { getConversationCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { conversations, members } from '@/db/schema'
import {
  type CreateConversationInput,
  createConversationInputSchema,
} from '@/features/conversations/types/schemas/create-conversation-input-schema'
import { getSession } from '@/lib/auth/session'
import type { SubmissionResult } from '@conform-to/react'
import { and, eq, or } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export const createConversationAction = async (
  data: CreateConversationInput,
) => {
  const result = createConversationInputSchema.safeParse(data)

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
    } as const satisfies SubmissionResult<string[]>
  }

  const currentMember = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, result.data.workspaceId),
      eq(members.userId, session.user.id),
    ),
  })

  const otherMember = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, result.data.workspaceId),
      eq(members.userId, result.data.memberId),
    ),
  })

  if (!(currentMember && otherMember)) {
    return {
      status: 'error',
      error: {
        message: ['member not found'],
      },
    } as const satisfies SubmissionResult<string[]>
  }

  const existingConversation = await db.query.conversations.findFirst({
    where: and(
      eq(conversations.workspaceId, result.data.workspaceId),
      or(
        and(
          eq(conversations.memberOneId, currentMember.userId ?? ''),
          eq(conversations.memberTwoId, otherMember.userId ?? ''),
        ),
        and(
          eq(conversations.memberOneId, otherMember.userId ?? ''),
          eq(conversations.memberTwoId, currentMember.userId ?? ''),
        ),
      ),
    ),
  })

  if (existingConversation) {
    return {
      status: 'success',
      initialValue: {
        conversation: JSON.stringify(existingConversation),
      },
    } as const satisfies SubmissionResult<string[]>
  }

  const [newConversationId] = await db
    .insert(conversations)
    .values({
      workspaceId: result.data.workspaceId,
      memberOneId: currentMember.userId ?? '',
      memberTwoId: otherMember.userId ?? '',
    })
    .returning({
      id: conversations.id,
      memberTwoId: conversations.memberTwoId,
    })

  revalidateTag(
    `${getConversationCacheKey}/${result.data.workspaceId}/${newConversationId.memberTwoId}`,
  )

  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, newConversationId.id),
  })

  if (!conversation) {
    return {
      status: 'error',
      error: {
        message: ['conversation not found'],
      },
    } as const satisfies SubmissionResult<string[]>
  }

  return {
    status: 'success',
    initialValue: {
      conversation: JSON.stringify(conversation),
    },
  } as const satisfies SubmissionResult<string[]>
}
