'use client'

import { JotaiProvider } from '@/components/providers/jotai-provider'
import { QueryProvider } from '@/components/providers/query-client-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import type { Route } from 'next'
import { SessionProvider } from 'next-auth/react'
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useState } from 'react'
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

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const navigate = (path: string, routerOptions?: NavigateOptions) => {
    router.push(path as Route<string>, routerOptions)
  }

  return (
    <RouterProvider navigate={navigate}>
      <ThemeProvider enableSystem={true} attribute="class">
        <QueryProvider>
          <JotaiProvider>
            <SessionProvider>{children}</SessionProvider>
          </JotaiProvider>
        </QueryProvider>
      </ThemeProvider>
    </RouterProvider>
  )
}
