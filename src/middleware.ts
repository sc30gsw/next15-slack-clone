import { getSession } from '@/lib/auth/session'
import { type NextRequest, NextResponse } from 'next/server'

export const middleware = async (req: NextRequest) => {
	const session = await getSession()

	if (session) {
		return NextResponse.next()
	}

	return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`)
}

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|sign-in|sign-up|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}

// biome-ignore lint/performance/noBarrelFile: This is a barrel file
export { auth as authMiddleware } from '@/auth'
