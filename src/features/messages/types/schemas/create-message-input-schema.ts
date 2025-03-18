import { z } from 'zod'

export const crateMessageInputSchema = z.object({
  text: z.string({ required_error: 'Text is required' }),
})

export type CreateMessageInput = z.infer<typeof crateMessageInputSchema>
