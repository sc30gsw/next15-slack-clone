import { Skeleton } from '@/components/justd/ui'

const WorkspaceSidebarLoading = () => {
  return (
    <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
      <Skeleton className="w-full h-5 bg-zinc-400/40" />
    </div>
  )
}

export default WorkspaceSidebarLoading
