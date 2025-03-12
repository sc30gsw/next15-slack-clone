'use server'

import { getWorkspacesCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { members, workspaces } from '@/db/schema'
import { getSession } from '@/lib/auth/session'
import { generateJoinCode } from '@/utils/generate-join-code'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { unauthorized } from 'next/navigation'

export const newJoinCodeAction = async (workspaceId: string) => {
  const session = await getSession()

  if (!session?.user?.id) {
    unauthorized()
  }

  const member = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, workspaceId),
      eq(members.userId, session.user.id),
    ),
  })

  if (!member || member.role !== 'admin') {
    unauthorized()
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
