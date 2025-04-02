import { Loader } from '@/components/justd/ui'

const ProfileLoading = () => {
  return (
    <div className="h-full flex-1 relative">
      <Loader
        size="medium"
        intent="secondary"
        className="animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  )
}

export default ProfileLoading
