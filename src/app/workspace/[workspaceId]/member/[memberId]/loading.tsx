import { Loader } from '@/components/justd/ui'

const MemberIdLoading = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Loader size="medium" intent="secondary" className="animate-spin" />
    </div>
  )
}

export default MemberIdLoading
