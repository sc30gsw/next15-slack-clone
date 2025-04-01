import { Skeleton } from '@/components/justd/ui'
import {
  getWorkspaceCurrentMember,
  getWorkspaceMembers,
} from '@/features/members/server/fetcher'
import { SidebarItem } from '@/features/workspaces/components/sidebar-item'
import { WorkspaceChannels } from '@/features/workspaces/components/workspace-channels'
import { WorkspaceHeaderContainer } from '@/features/workspaces/components/workspace-header-container'
import { WorkspaceMembers } from '@/features/workspaces/components/workspace-members'
import { WorkspaceSection } from '@/features/workspaces/components/workspace-section'
import { getSession } from '@/lib/auth/session'
import {
  IconMessageDots,
  IconSend2,
  IconTriangleExclamation,
} from 'justd-icons'
import { Suspense } from 'react'

type WorkspaceSidebarProps = {
  workspaceId: string
  memberId?: string
}

export const WorkspaceSidebar = async ({
  workspaceId,
}: WorkspaceSidebarProps) => {
  const session = await getSession()

  const member = await getWorkspaceCurrentMember({
    param: { workspaceId },
    userId: session?.user?.id,
  })

  if (!member) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <IconTriangleExclamation className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    )
  }

  const membersPromise = getWorkspaceMembers({
    param: { workspaceId },
    userId: session?.user?.id,
  })

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <Suspense
        fallback={
          <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
            <Skeleton className="w-full h-5 bg-zinc-400/40" />
          </div>
        }
      >
        <WorkspaceHeaderContainer
          workspaceId={workspaceId}
          isAdmin={member.role === 'admin'}
        />
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
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        isNew={true}
        modalKinds="channel"
        isAdmin={member.role === 'admin'}
      >
        <Suspense
          fallback={<Skeleton className="h-4 w-22 ml-4 bg-zinc-400/40" />}
        >
          <WorkspaceChannels workspaceId={workspaceId} />
        </Suspense>
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        isNew={true}
        modalKinds="dm"
        isAdmin={member.role === 'admin'}
      >
        <Suspense
          fallback={
            <div className="flex items-center gap-1.5 ml-4">
              <Skeleton className="size-6 mr-4 bg-zinc-400/40" />
              <Skeleton className="h-4 w-20 bg-zinc-400/40" />
            </div>
          }
        >
          <WorkspaceMembers membersPromise={membersPromise} />
        </Suspense>
      </WorkspaceSection>
    </div>
  )
}
