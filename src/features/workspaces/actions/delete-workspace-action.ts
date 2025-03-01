'use server'
import { db } from '@/db/db'
import { members, workspaces } from '@/db/schema'
import { getSession } from '@/lib/auth/session'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { unauthorized } from 'next/navigation'

export const deleteWorkspaceAction = async (workspaceId: string) => {
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

  await db
    .delete(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .returning({ id: workspaces.id })

  revalidatePath(`/workspace/${workspaceId}`)
}
