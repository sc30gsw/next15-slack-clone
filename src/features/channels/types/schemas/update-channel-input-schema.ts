import { z } from 'zod'

export const updateChannelInputSchema = z.object({
  id: z.string({ required_error: 'ID is required' }),
  name: z.string({ required_error: 'Name is required' }).max(128, {
    message: 'Name is too long',
  }),
  workspaceId: z.string({ required_error: 'Workspace ID is required' }),
})

export type UpdateChannelInput = z.infer<typeof updateChannelInputSchema>
