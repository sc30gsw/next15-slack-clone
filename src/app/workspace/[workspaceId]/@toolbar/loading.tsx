import { Skeleton } from '@/components/justd/ui'

const ToolbarLoading = () => {
  return (
    <div className="bg-[#481349] flex items-center justify-center  h-10 p-1.5">
      <Skeleton className="min-w-[280px] max-w-[642px]  h-7 grow-[2] shrink bg-zinc-400/40" />
    </div>
  )
}

export default ToolbarLoading
