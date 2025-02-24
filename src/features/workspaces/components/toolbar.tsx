import { Button, Skeleton } from '@/components/justd/ui'
import { getWorkspace } from '@/features/workspaces/server/fetcher'
import { IconCircleInfo, IconSearch } from 'justd-icons'
import { Suspense } from 'react'

type ToolbarProps = {
  workspaceId: string
}

export const Toolbar = ({ workspaceId }: ToolbarProps) => {
  const workspacePromise = getWorkspace({ param: { id: workspaceId } })

  return (
    <div className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <Suspense
        fallback={
          <Skeleton className="min-w-[280px] max-[642px] h-7 grow-[2] shrink bg-zinc-400/40" />
        }
      >
        <div className="min-w-[280px] max-[642px] grow-[2] shrink">
          <Button
            size="small"
            className="bg-secondary/25 hover:bg-secondary-25 data-hovered:bg-secondary-25 data-pressed:bg-secondary-25 w-full h-7 justify-start px-2"
          >
            <IconSearch className="size-4 text-white mr-2" />
            <span className="text-white text-xs">
              Search {workspacePromise.then((workspace) => workspace.name)}
            </span>
          </Button>
        </div>
      </Suspense>

      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button
          size="square-petite"
          appearance="plain"
          className="bg-transparent hover:bg-accent/10 text-white data-hovered:bg-accent/10 data-pressed:bg-accent/10"
        >
          <IconCircleInfo className="size-5" />
        </Button>
      </div>
    </div>
  )
}
