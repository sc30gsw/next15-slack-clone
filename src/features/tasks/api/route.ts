import { fetchQuery } from 'convex/nextjs'
import { Hono } from 'hono'
import { api } from '../../../../convex/_generated/api'

const app = new Hono().get('/', async (c) => {
	const tasks = await fetchQuery(api.tasks.get)

	return c.json(tasks)
})

export default app
