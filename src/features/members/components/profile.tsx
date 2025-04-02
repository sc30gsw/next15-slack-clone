import { PanelCloseButton } from '@/components/ui/panel-close-button'
import { ProfileContentContainer } from '@/features/members/components/profile-content-container'
import { Suspense } from 'react'

export const Profile = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="h-12.25 flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Profile</p>
        <PanelCloseButton />
      </div>
      <Suspense>
        <ProfileContentContainer />
      </Suspense>
    </div>
  )
}
