import { Loader } from '@/components/justd/ui'

const ThreadLoading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader size="medium" className="animate-spin" />
    </div>
  )
}

export default ThreadLoading
