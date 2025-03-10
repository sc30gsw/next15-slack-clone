import { z } from 'zod'

export const createChannelInputSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).max(128, {
    message: 'Name is too long',
  }),
  workspaceId: z.string({ required_error: 'Workspace ID is required' }),
})

export type CreateChannelInput = z.infer<typeof createChannelInputSchema>
