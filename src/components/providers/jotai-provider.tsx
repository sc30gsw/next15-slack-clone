import { Provider } from 'jotai'
import type { ReactNode } from 'react'

export const JotaiProvider = ({ children }: Record<'children', ReactNode>) => {
  return <Provider>{children}</Provider>
}
