import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	client: {
		NEXT_PUBLIC_CONVEX_URL: z.string().url(),
		NEXT_PUBLIC_APP_URL: z.string().url(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	},
})
