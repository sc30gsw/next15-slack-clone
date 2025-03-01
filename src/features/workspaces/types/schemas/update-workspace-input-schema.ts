import { z } from 'zod'

export const updateWorkspaceInputSchema = z.object({
  id: z.string({ required_error: 'ID is required' }),
  name: z.string({ required_error: 'Name is required' }).max(128, {
    message: 'Name is too long',
  }),
})

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceInputSchema>
