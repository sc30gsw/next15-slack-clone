import {
  IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  sizeInMB,
} from '@/features/messages/utils/size-in-mb'
import { z } from 'zod'

export const crateMessageInputSchema = z.object({
  body: z.string({ required_error: 'Body is required' }),
  image: z
    .custom<File>()
    .transform((val) => {
      if (val instanceof File) {
        return val
      }

      return null
    })
    .refine(
      (file) => {
        if (file === null) {
          return true
        }

        return sizeInMB(file.size) <= MAX_IMAGE_SIZE
      },
      {
        message: 'The file size must be up to 4.5MB',
      },
    )
    .refine(
      (file) => {
        if (file === null) {
          return true
        }

        return IMAGE_TYPES.includes(file.type)
      },
      {
        message: 'The file type must be jpg, png, jpeg, or gif',
      },
    )
    .nullable(),
  workspaceId: z.string({ required_error: 'Workspace ID is required' }),
  channelId: z.string().optional(),
  parentMessageId: z.string().optional(),
  conversationId: z.string().optional(),
})

export type CreateMessageInput = z.infer<typeof crateMessageInputSchema>
