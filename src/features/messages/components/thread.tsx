import { ThreadCloseButton } from '@/features/messages/components/thread-close-button'
import { ThreadMessage } from '@/features/messages/components/thread-message'
import { getSession } from '@/lib/auth/session'

export const Thread = async () => {
  const session = await getSession()

  return (
    <div className="h-full flex flex-col">
      <div className="h-12.25 flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <ThreadCloseButton />
      </div>
      <ThreadMessage userId={session?.user?.id} />
    </div>
  )
}
