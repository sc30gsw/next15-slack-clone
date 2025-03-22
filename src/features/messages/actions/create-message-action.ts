'use server'
import { db } from '@/db/db'
import { members, messages } from '@/db/schema'
import {
  type CreateMessageInput,
  crateMessageInputSchema,
} from '@/features/messages/types/schemas/create-message-input-schema'
import { getSession } from '@/lib/auth/session'
import { and, eq } from 'drizzle-orm'

const fileToBase64 = async (file: File) => {
  if (!file) {
    return {
      status: 'error',
      error: {
        message: ['File is required'],
      },
    }
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)

    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }

    return {
      status: 'success',
      base64: `data:${file.type};base64,${btoa(binary)}`,
    }
  } catch (_) {
    return {
      status: 'error',
      error: {
        message: ['Failed to convert file to Base64'],
      },
    }
  }
}

export const createMessageAction = async (data: CreateMessageInput) => {
  const result = crateMessageInputSchema.safeParse(data)

  if (!result.success) {
    return {
      status: 'error',
      error: {
        message: result.error.errors,
      },
    }
  }

  const session = await getSession()

  if (!session?.user?.id) {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    }
  }

  const member = await db.query.members.findFirst({
    where: and(
      eq(members.workspaceId, result.data.workspaceId),
      eq(members.userId, session.user.id),
    ),
  })

  if (!member) {
    return {
      status: 'error',
      error: {
        message: ['unauthorized'],
      },
    }
  }

  let imageBase64: string | null = null

  if (result.data.image instanceof File) {
    const getBase64Result = await fileToBase64(result.data.image)

    if (getBase64Result.status === 'success') {
      imageBase64 = getBase64Result.base64 ?? null
    }
  }

  const [newMessagesId] = await db
    .insert(messages)
    .values({
      body: data.body,
      image: imageBase64,
      workspaceId: data.workspaceId,
      channelId: data.channelId,
      parentMessageId: data.parentMessageId,
      // TODO: add conversationId
      userId: session.user.id,
    })
    .returning({ id: messages.id })

  return {
    status: 'success',
    initialValue: {
      body: newMessagesId.id,
    },
  }
}
