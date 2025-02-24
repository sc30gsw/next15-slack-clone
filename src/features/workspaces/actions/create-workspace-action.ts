'use server'

import { getWorkspacesCacheKey } from '@/constants/cache-keys'
import { db } from '@/db/db'
import { members, workspaces } from '@/db/schema'
import { createWorkspaceInputSchema } from '@/features/workspaces/types/schemas/create-workspace-input-schema'
import { getSession } from '@/lib/auth/session'
import { parseWithZod } from '@conform-to/zod'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () =>
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[
        Math.floor(Math.random() * 62)
      ],
  ).join('')

  return code
}

export const createWorkspaceAction = async (
  _: unknown,
  formData: FormData,
  isRedirect: boolean,
) => {
  const submission = parseWithZod(formData, {
    schema: createWorkspaceInputSchema,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const session = await getSession()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const [newWorkspace] = await db
    .insert(workspaces)
    .values({
      name: submission.value.name,
      joinCode: generateCode(),
      userId: session.user.id,
    })
    .returning()

  await db.insert(members).values({
    userId: session.user.id,
    workspaceId: newWorkspace.id,
    role: 'admin',
  })

  revalidateTag(getWorkspacesCacheKey)

  if (isRedirect) {
    redirect(`/workspace/${newWorkspace.id}`)
  }

  return {
    status: 'success',
    initialValue: {
      name: newWorkspace.id,
    },
  } as const satisfies ReturnType<typeof submission.reply>
}
