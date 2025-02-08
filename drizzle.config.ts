import { env } from '@/env'
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env' })

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './migrations',
	dialect: 'turso',
	dbCredentials: {
		url: env.TURSO_CONNECTION_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	},
})
