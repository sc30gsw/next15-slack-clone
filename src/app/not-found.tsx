import { IconTriangleExclamation } from 'justd-icons'
import { headers } from 'next/headers'

const NotFound = async () => {
  const headersList = await headers()
  const referer = headersList.get('referer')

  const isWorkspacePage = referer?.includes('workspace')

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <IconTriangleExclamation className="size-6 text-muted-foreground" />
      <span className="text-sm text-fg">
        {isWorkspacePage ? 'Workspace not found' : 'This page is not found'}
      </span>
    </div>
  )
}

export default NotFound
