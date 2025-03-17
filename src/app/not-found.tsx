import { IconTriangleExclamation } from 'justd-icons'
import { headers } from 'next/headers'

const NotFound = async () => {
  const headersList = await headers()
  const referer = headersList.get('referer')

  const isWorkspacePage = referer?.includes('workspace')
  const isChannelPage = referer?.includes('channel')

  const getErrorMessage = (referer: 'workspace' | 'channel' | 'default') => {
    switch (referer) {
      case 'workspace':
        return 'No channel found'
      case 'channel':
        return 'Channel not found'
      default:
        return 'This page is not found'
    }
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
      <IconTriangleExclamation className="size-6 text-muted-foreground" />
      <span className="text-sm text-fg">
        {getErrorMessage(
          isWorkspacePage ? 'workspace' : isChannelPage ? 'channel' : 'default',
        )}
      </span>
    </div>
  )
}

export default NotFound
