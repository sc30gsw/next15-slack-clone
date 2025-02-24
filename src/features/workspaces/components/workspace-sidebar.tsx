import { Skeleton } from '@/components/justd/ui'
import { WorkspaceHeader } from '@/features/workspaces/components/workspace-header'
import {
  getWorkspace,
  getWorkspaceMembers,
} from '@/features/workspaces/server/fetcher'
import type {} from 'hono'
import { IconTriangleExclamation } from 'justd-icons'
import { Suspense } from 'react'

type WorkspaceSidebarProps = {
  workspaceId: string
}

export const WorkspaceSidebar = async ({
  workspaceId,
}: WorkspaceSidebarProps) => {
  const [res, workspace] = await Promise.all([
    getWorkspaceMembers({ param: { workspaceId } }),
    getWorkspace({ param: { id: workspaceId } }),
  ])

  if (!res.member) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <IconTriangleExclamation className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
          <Skeleton className="w-full h-5 bg-zinc-400/40" />
        </div>
      }
    >
      <div className="flex flex-col bg-[#5E2C5F] h-full">
        <WorkspaceHeader
          workspaceName={workspace.name}
          isAdmin={res.member.role === 'admin'}
        />
      </div>
    </Suspense>
  )
}
