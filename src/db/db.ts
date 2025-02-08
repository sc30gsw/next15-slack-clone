// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as schema from '@/db/schema'
import { env } from '@/env'
import { drizzle } from 'drizzle-orm/libsql'

export const db = drizzle({
	connection: {
		url: env.TURSO_CONNECTION_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	},
	schema: schema,
})
