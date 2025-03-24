import { Loader } from '@/components/justd/ui'

const WorkspaceIdLoading = () => {
  return (
    <div className="h-full flex items-center justify-center flex-col gap-y-2">
      <Loader size="medium" intent="secondary" className="animate-spin" />
    </div>
  )
}

export default WorkspaceIdLoading
