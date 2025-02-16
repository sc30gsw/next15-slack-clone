import 'server-only'
import { db } from '@/db/db'
import { type SelectUser, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createMiddleware } from 'hono/factory'

type AdditionalContext = Record<
  'Variables',
  {
    user: SelectUser
  }
>

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const userId = c.req.header('Authorization')

    if (!userId) {
      return c.json({ error: { message: 'Unauthorized' } }, 401)
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return c.json({ error: { message: 'User not found' } }, 404)
    }

    c.set('user', user)

    await next()
  },
)
