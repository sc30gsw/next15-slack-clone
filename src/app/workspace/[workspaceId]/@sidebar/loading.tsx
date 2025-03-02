import { Skeleton } from '@/components/justd/ui'

const SidebarLoading = () => {
  return (
    <>
      <Skeleton intent="lighter" className="size-9 bg-zinc-400/40" />
      <div className="flex flex-col items-center gap-1">
        <Skeleton intent="lighter" className="size-9 bg-zinc-400/40" />
        <Skeleton intent="muted" className="h-2 w-7.5 bg-zinc-400/40" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <Skeleton intent="lighter" className="size-9 bg-zinc-400/40" />
        <Skeleton intent="muted" className="h-2 w-7.5 bg-zinc-400/40" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <Skeleton intent="lighter" className="size-9 bg-zinc-400/40" />
        <Skeleton intent="muted" className="h-2 w-7.5 bg-zinc-400/40" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <Skeleton intent="lighter" className="size-9 bg-zinc-400/40" />
        <Skeleton intent="muted" className="h-2 w-7.5 bg-zinc-400/40" />
      </div>
    </>
  )
}

export default SidebarLoading
