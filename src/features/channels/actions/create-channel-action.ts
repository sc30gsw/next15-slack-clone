'use server'

import { getChannelsCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { channels, members } from '@/db/schema'
import { createChannelInputSchema } from '@/features/channels/types/schemas/create-channel-schema'
import { getSession } from '@/lib/auth/session'
import { parseWithZod } from '@conform-to/zod'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export const createChannelAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: createChannelInputSchema,
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
      eq(members.workspaceId, submission.value.workspaceId),
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

  const parsedName = submission.value.name.replace(/\s+/g, '-').toLowerCase()

  await db
    .insert(channels)
    .values({
      name: parsedName,
      workspaceId: submission.value.workspaceId,
    })
    .returning({ id: channels.id })

  revalidateTag(`${getChannelsCacheKey}/${submission.value.workspaceId}`)

  return submission.reply()
}
