import { Skeleton } from '@/components/justd/ui'

const SidebarLoading = () => {
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <Skeleton className="size-9 bg-zinc-400/40" />
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="size-9 bg-zinc-400/40" />
        <Skeleton className="h-2 w-7.5 bg-zinc-400/40" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="size-9 bg-zinc-400/40" />
        <Skeleton className="h-2 w-7.5 bg-zinc-400/40" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="size-9 bg-zinc-400/40" />
        <Skeleton className="h-2 w-7.5 bg-zinc-400/40" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="size-9 bg-zinc-400/40" />
        <Skeleton className="h-2 w-7.5 bg-zinc-400/40" />
      </div>
    </aside>
  )
}

export default SidebarLoading
