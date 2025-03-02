import { Skeleton } from '@/components/justd/ui'
import { SidebarItem } from '@/features/workspaces/components/sidebar-item'
import { WorkspaceHeaderContainer } from '@/features/workspaces/components/workspace-header-container'
import { IconMessageDots, IconSend2 } from 'justd-icons'
import { Suspense } from 'react'

type WorkspaceSidebarProps = {
  workspaceId: string
}

export const WorkspaceSidebar = ({ workspaceId }: WorkspaceSidebarProps) => {
  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <Suspense
        fallback={
          <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
            <Skeleton className="w-full h-5 bg-zinc-400/40" />
          </div>
        }
      >
        <WorkspaceHeaderContainer workspaceId={workspaceId} />
      </Suspense>

      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          workspaceId={workspaceId}
          id="threads"
          label="Threads"
          icon={IconMessageDots}
        />
        <SidebarItem
          workspaceId={workspaceId}
          id="drafts"
          label="Drafts & Sent"
          icon={IconSend2}
        />
      </div>
    </div>
  )
}
