import { z } from 'zod'

export const createConversationInputSchema = z.object({
  workspaceId: z.string({ required_error: 'Workspace ID is required' }),
  memberId: z.string({ required_error: 'Member ID is required' }),
})

export type CreateConversationInput = z.infer<
  typeof createConversationInputSchema
>
