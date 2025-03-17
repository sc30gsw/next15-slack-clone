'use server'

import { getChannelCacheKey, getChannelsCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { channels, members } from '@/db/schema'
import { getSession } from '@/lib/auth/session'
import type { SubmissionResult } from '@conform-to/react'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export const deleteChannelAction = async (
  channelId: string,
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

  const member = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, workspaceId),
      eq(members.userId, session.user.id),
    ),
  })

  if (!member || member.role !== 'admin') {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    } as const satisfies SubmissionResult
  }

  await db.delete(channels).where(eq(channels.id, channelId))

  revalidateTag(`${getChannelCacheKey}/${channelId}`)
  revalidateTag(`${getChannelsCacheKey}/${workspaceId}`)
}
