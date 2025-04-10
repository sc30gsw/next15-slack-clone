import { Button, Skeleton } from '@/components/justd/ui'
import { getChannels } from '@/features/channels/server/fetcher'
import { getWorkspaceMembers } from '@/features/members/server/fetcher'
import { SearchMenu } from '@/features/workspaces/components/search-menu'
import { getWorkspace } from '@/features/workspaces/server/fetcher'
import { getSession } from '@/lib/auth/session'
import { IconCircleInfo, IconSearch } from 'justd-icons'
import { Suspense } from 'react'

type ToolbarProps = {
  workspaceId: string
}

export const Toolbar = async ({ workspaceId }: ToolbarProps) => {
  const session = await getSession()
  const workspacePromise = getWorkspace({
    param: { id: workspaceId },
    userId: session?.user?.id,
  })

  const searchPromise = Promise.all([
    getChannels({
      param: { workspaceId },
      userId: session?.user?.id,
    }),
    getWorkspaceMembers({
      param: { workspaceId },
      userId: session?.user?.id,
    }),
  ])

  return (
    <div className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <Suspense
        fallback={
          <Skeleton className="min-w-[280px] max-[642px] h-7 grow-[2] shrink bg-zinc-400/40" />
        }
      >
        {searchPromise.then(([channels, members]) => (
          <SearchMenu
            channels={channels}
            members={members}
            workspaceId={workspaceId}
          >
            <IconSearch className="size-4 text-white mr-2" />
            <span className="text-white text-xs">
              Search {workspacePromise.then((workspace) => workspace.name)}
            </span>
          </SearchMenu>
        ))}
      </Suspense>

      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button
          size="square-petite"
          intent="plain"
          className="bg-transparent hover:bg-accent/10 text-white data-hovered:bg-accent/10 data-pressed:bg-accent/10"
        >
          <IconCircleInfo className="size-5" />
        </Button>
      </div>
    </div>
  )
}
