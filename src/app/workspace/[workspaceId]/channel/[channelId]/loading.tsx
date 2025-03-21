import { Loader } from '@/components/justd/ui'

const ChannelIdLoading = () => {
  return (
    <div className="h-full flex-1 items-center justify-center">
      <Loader size="medium" intent="secondary" className="animate-spin" />
    </div>
  )
}

export default ChannelIdLoading
