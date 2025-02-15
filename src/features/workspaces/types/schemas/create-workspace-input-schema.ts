import { z } from 'zod'

export const createWorkspaceInputSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).max(128, {
    message: 'Name is too long',
  }),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceInputSchema>
