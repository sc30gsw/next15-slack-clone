'use server'

import { db } from '@/db/db'
import { members, messages } from '@/db/schema'
import {
  type CreateMessageInput,
  crateMessageInputSchema,
} from '@/features/messages/types/schemas/create-message-input-schema'
import { getSession } from '@/lib/auth/session'
import { client } from '@/lib/rpc'
import { and, eq } from 'drizzle-orm'
import type { InferResponseType } from 'hono'

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

  let imageUrl: string | null = null

  if (result.data.image instanceof File) {
    try {
      type ResType = InferResponseType<typeof client.api.upload.$post, 200>
      const url = client.api.upload.$url()

      const formData = new FormData()
      formData.append('file', result.data.image)

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          // biome-ignore lint/style/useNamingConvention: It needs to be snake_case
          Authorization: session.user.id,
        },
      })

      const json: ResType = await res.json()

      imageUrl = json.url
    } catch (_) {
      return {
        status: 'error',
        error: {
          message: ['Failed to upload image'],
        },
      }
    }
  } else {
    // File型でない場合、他の処理やデフォルトの値を返す
    imageUrl = null
  }

  // ここでメッセージをデータベースに登録
  const [newMessagesId] = await db
    .insert(messages)
    .values({
      body: data.body,
      image: imageUrl,
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
