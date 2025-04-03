import { z } from 'zod'

export const memberDetailInputSchema = z.object({
  memberId: z.string({ required_error: 'ID is required' }),
  workspaceId: z.string({ required_error: 'Workspace ID is required' }),
  role: z.enum(['admin', 'member']).optional(),
})

export type MemberDetailInput = z.infer<typeof memberDetailInputSchema>
