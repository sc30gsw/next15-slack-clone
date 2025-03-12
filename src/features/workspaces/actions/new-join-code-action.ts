'use server'

import { getWorkspacesCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { members, workspaces } from '@/db/schema'
import { getSession } from '@/lib/auth/session'
import { generateJoinCode } from '@/utils/generate-join-code'
import type { SubmissionResult } from '@conform-to/react'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export const newJoinCodeAction = async (workspaceId: string) => {
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

  const joinCode = generateJoinCode()

  const [updatedWorkspaceId] = await db
    .update(workspaces)
    .set({
      joinCode,
    })
    .where(eq(workspaces.id, workspaceId))
    .returning({ id: workspaces.id })

  revalidateTag(`${getWorkspacesCacheKey}/${workspaceId}`)

  return updatedWorkspaceId
}
