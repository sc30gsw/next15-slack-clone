import { Skeleton } from '@/components/justd/ui'
import { IconMail } from 'justd-icons'
import { Separator } from 'react-aria-components'

export const ProfileLoading = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-4">
        <Skeleton className="w-63.5 h-63.5" />
      </div>
      <div className="flex flex-col p-4">
        <Skeleton className="h-7 w-40" />
      </div>
      <Separator />
      <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact information</p>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <IconMail className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-muted-fg">Email Address</p>
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
      </div>
    </>
  )
}
