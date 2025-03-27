import { z } from 'zod'

export const toggleReactionInputSchema = z.object({
  messageId: z.string({ required_error: 'ID is required' }),
  value: z.string({ required_error: 'Body is required' }),
})

export type ToggleReactionInput = z.infer<typeof toggleReactionInputSchema>
