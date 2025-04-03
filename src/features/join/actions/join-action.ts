'use server'

import {
  getWorkspaceInfoCacheKey,
  getWorkspacesCacheKey,
} from '@/constants/cache-keys'
import { db } from '@/db/db'
import { members, workspaces } from '@/db/schema'
import { getSession } from '@/lib/auth/session'
import type { SubmissionResult } from '@conform-to/react'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { unauthorized } from 'next/navigation'

export const joinAction = async (workspaceId: string, joinCode: string) => {
  const session = await getSession()

  if (!session?.user?.id) {
    unauthorized()
  }

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  })

  if (!workspace) {
    return {
      status: 'error',
      error: {
        message: ['not found'],
      },
    } as const satisfies SubmissionResult
  }

  if (workspace.joinCode.toUpperCase() !== joinCode.toUpperCase()) {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    } as const satisfies SubmissionResult
  }

  const existMember = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, workspaceId),
      eq(members.userId, session.user.id),
    ),
  })

  if (existMember) {
    throw new Error('Already a member of this workspace')
  }

  await db.insert(members).values({
    userId: session.user.id,
    workspaceId,
    role: 'member',
  })

  revalidateTag(`${getWorkspacesCacheKey}/${workspaceId}`)
  revalidateTag(`${getWorkspaceInfoCacheKey}/${workspaceId}`)

  return {
    status: 'success',
    initialValue: {
      workspaceId,
    },
  } as const satisfies SubmissionResult
}
