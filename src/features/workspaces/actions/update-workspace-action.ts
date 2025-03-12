'use server'

import { getWorkspacesCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { members, workspaces } from '@/db/schema'
import { updateWorkspaceInputSchema } from '@/features/workspaces/types/schemas/update-workspace-input-schema'
import { getSession } from '@/lib/auth/session'
import { parseWithZod } from '@conform-to/zod'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export const updateWorkspaceAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: updateWorkspaceInputSchema,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const session = await getSession()

  if (!session?.user?.id) {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    } as const satisfies ReturnType<typeof submission.reply>
  }

  const member = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, submission.value.id),
      eq(members.userId, session.user.id),
    ),
  })

  if (!member || member.role !== 'admin') {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    } as const satisfies ReturnType<typeof submission.reply>
  }

  await db
    .update(workspaces)
    .set({
      name: submission.value.name,
    })
    .where(eq(workspaces.id, submission.value.id))

  revalidateTag(`${getWorkspacesCacheKey}/${submission.value.id}`)

  return submission.reply()
}
