import { uploadInputSchema } from '@/features/upload/types/schemas/upload-input-schema'
import { sessionMiddleware } from '@/lib/auth/session-middleware'
import { zValidator } from '@hono/zod-validator'
import { put } from '@vercel/blob'
import { Hono } from 'hono'

const app = new Hono().post(
  '/',
  sessionMiddleware,
  zValidator('form', uploadInputSchema),
  async (c) => {
    try {
      const { file } = c.req.valid('form')

      const fileExtension = file.name.split('.').pop() || ''
      const uniqueFilename = `${crypto.randomUUID()}.${fileExtension}`

      const blob = await put(uniqueFilename, file, {
        access: 'public',
      })

      return c.json({ url: blob.url }, 200)
    } catch (_) {
      return c.json({ error: 'Failed to upload file' }, 500)
    }
  },
)

export default app
