'use server'

import { getChannelCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { channels, members } from '@/db/schema'
import { updateChannelInputSchema } from '@/features/channels/types/schemas/update-channel-input-schema'
import { getSession } from '@/lib/auth/session'
import { parseWithZod } from '@conform-to/zod'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

export const updateChannelAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: updateChannelInputSchema,
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

  await db
    .update(channels)
    .set({
      name: submission.value.name,
    })
    .where(eq(channels.id, submission.value.id))

  revalidateTag(`${getChannelCacheKey}/${submission.value.id}`)

  return submission.reply()
}
