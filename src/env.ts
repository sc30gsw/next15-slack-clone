import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		TURSO_CONNECTION_URL: z.string().url(),
		TURSO_AUTH_TOKEN: z.string(),
	},
	client: {
		NEXT_PUBLIC_APP_URL: z.string().url(),
	},
	runtimeEnv: {
		TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
		TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	},
})
