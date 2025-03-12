'use server'

import { getWorkspacesCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { channels, members, workspaces } from '@/db/schema'
import { createWorkspaceInputSchema } from '@/features/workspaces/types/schemas/create-workspace-input-schema'
import { getSession } from '@/lib/auth/session'
import { generateJoinCode } from '@/utils/generate-join-code'
import { parseWithZod } from '@conform-to/zod'
import { revalidateTag } from 'next/cache'

export const createWorkspaceAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: createWorkspaceInputSchema,
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

  const [newWorkspaceId] = await db
    .insert(workspaces)
    .values({
      name: submission.value.name,
      joinCode: generateJoinCode(),
      userId: session.user.id,
    })
    .returning({ id: workspaces.id })

  const insertMembers = db.insert(members).values({
    userId: session.user.id,
    workspaceId: newWorkspaceId.id,
    role: 'admin',
  })

  const insertChannels = db.insert(channels).values({
    name: 'general',
    workspaceId: newWorkspaceId.id,
  })

  await Promise.all([insertMembers, insertChannels])

  revalidateTag(getWorkspacesCacheKey)

  return {
    status: 'success',
    initialValue: {
      name: newWorkspaceId.id,
    },
  } as const satisfies ReturnType<typeof submission.reply>
}
