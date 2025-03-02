import { Hint } from '@/components/ui/hint'
import { getWorkspaceMembers } from '@/features/members/server/fetcher'
import { WorkspaceHeader } from '@/features/workspaces/components/workspace-header'
import { getWorkspace } from '@/features/workspaces/server/fetcher'
import { getSession } from '@/lib/auth/session'
import {
  IconFilter2,
  IconPencilBox,
  IconTriangleExclamation,
} from 'justd-icons'

type WorkspaceHeaderContainerProps = {
  workspaceId: string
}

export const WorkspaceHeaderContainer = async ({
  workspaceId,
}: WorkspaceHeaderContainerProps) => {
  const session = await getSession()

  const res = await getWorkspaceMembers({
    param: { workspaceId },
    userId: session?.user?.id,
  })

  if (!res.member) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <IconTriangleExclamation className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    )
  }

  const workspace = await getWorkspace({
    param: { id: workspaceId },
    userId: session?.user?.id,
  })

  return (
    <WorkspaceHeader
      workspaceName={workspace.name}
      isAdmin={res.member.role === 'admin'}
    >
      <div className="flex items-center gap-0.5">
        <Hint label="Search" placement="bottom" showArrow={false}>
          <div className="flex items-center bg-transparent hover:bg-neutral-200/60 outline-none border-none font-semibold text-white text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-200/60 data-pressed:bg-neutral-200/60 size-9 shrink-0 rounded-md cursor-pointer">
            <IconFilter2 className="size-4" />
          </div>
        </Hint>
        <Hint label="New message" placement="bottom" showArrow={false}>
          <div className="flex items-center bg-transparent hover:bg-neutral-200/60 outline-none border-none font-semibold text-white text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-200/60 data-pressed:bg-neutral-200/60 size-9 shrink-0 rounded-md cursor-pointer">
            <IconPencilBox className="size-4" />
          </div>
        </Hint>
      </div>
    </WorkspaceHeader>
  )
}
