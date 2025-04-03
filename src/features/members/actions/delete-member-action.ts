'use server'

import { db } from '@/db/db'
import { members } from '@/db/schema'
import { memberDetailInputSchema } from '@/features/members/types/schemas/member-detail-input-schema'
import { getSession } from '@/lib/auth/session'
import { parseWithZod } from '@conform-to/zod'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export const deleteMemberAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: memberDetailInputSchema,
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
      eq(members.userId, submission.value.memberId),
      eq(members.workspaceId, submission.value.workspaceId),
    ),
  })

  if (!member) {
    return {
      status: 'error',
      error: {
        message: ['Member not found'],
      },
    } as const satisfies ReturnType<typeof submission.reply>
  }

  if (member.role === 'admin') {
    return {
      status: 'error',
      error: {
        message: ['Admin cannot be removed'],
      },
    } as const satisfies ReturnType<typeof submission.reply>
  }

  const currentMember = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, submission.value.workspaceId),
      eq(members.userId, session.user.id),
    ),
  })

  if (!currentMember) {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    } as const satisfies ReturnType<typeof submission.reply>
  }

  if (
    currentMember.userId === submission.value.memberId &&
    currentMember.role === 'admin'
  ) {
    return {
      status: 'error',
      error: {
        message: ['Cannot remove self if self is an admin'],
      },
    } as const satisfies ReturnType<typeof submission.reply>
  }

  await db
    .delete(members)
    .where(
      and(
        eq(members.workspaceId, submission.value.workspaceId),
        eq(members.userId, submission.value.memberId),
      ),
    )

  revalidatePath(`/workspace/${submission.value.workspaceId}`)

  return submission.reply()
}
