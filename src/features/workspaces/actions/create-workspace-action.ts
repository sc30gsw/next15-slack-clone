'use server'

import { db } from '@/db/db'
import { workspaces } from '@/db/schema'
import { createWorkspaceInputSchema } from '@/features/workspaces/types/schemas/create-workspace-input-schema'
import { getSession } from '@/lib/auth/session'
import { parseWithZod } from '@conform-to/zod'

export const createWorkspaceAction = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: createWorkspaceInputSchema,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    const session = await getSession()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const [newWorkspace] = await db
      .insert(workspaces)
      .values({
        name: submission.value.name,
        // TODO: Create a join code
        joinCode: '123456',
        userId: session.user.id,
      })
      .returning()

    return {
      status: 'success',
      initialValue: {
        name: newWorkspace.id,
      },
    } as const satisfies ReturnType<typeof submission.reply>
  } catch (_) {
    throw new Error('Something went wrong')
  }
}
