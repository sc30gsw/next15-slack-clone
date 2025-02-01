'use client'

import { ThemeProvider } from '@/components/providers/theme-provider'
import type { Route } from 'next'
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { RouterProvider } from 'react-aria-components'

declare module 'react-aria-components' {
	interface RouterConfig {
		routerOptions: NonNullable<
			Parameters<ReturnType<typeof useRouter>['push']>[1]
		>
	}
}

export const Providers = ({ children }: { children: ReactNode }) => {
	const router = useRouter()

	const navigate = (path: string, routerOptions?: NavigateOptions) => {
		router.push(path as Route<string>, routerOptions)
	}

	return (
		<RouterProvider navigate={navigate}>
			<ThemeProvider enableSystem={true} attribute="class">
				{children}
			</ThemeProvider>
		</RouterProvider>
	)
}
