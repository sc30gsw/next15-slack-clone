import { z } from 'zod'

export const updateMessageInputSchema = z.object({
  id: z.string({ required_error: 'ID is required' }),
  body: z.string({ required_error: 'Body is required' }),
  workspaceId: z.string({ required_error: 'Workspace ID is required' }),
  channelId: z.string().optional(),
  parentMessageId: z.string().optional(),
  conversationId: z.string().optional(),
})

export type UpdateMessageInput = z.infer<typeof updateMessageInputSchema>
