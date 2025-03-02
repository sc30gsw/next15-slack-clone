import { Hint } from '@/components/ui/hint'
import { WorkspaceHeader } from '@/features/workspaces/components/workspace-header'
import { getWorkspace } from '@/features/workspaces/server/fetcher'
import { getSession } from '@/lib/auth/session'
import { IconFilter2, IconPencilBox } from 'justd-icons'

type WorkspaceHeaderContainerProps = {
  workspaceId: string
  isAdmin: boolean
}

export const WorkspaceHeaderContainer = async ({
  workspaceId,
  isAdmin,
}: WorkspaceHeaderContainerProps) => {
  const session = await getSession()

  const workspace = await getWorkspace({
    param: { id: workspaceId },
    userId: session?.user?.id,
  })

  return (
    <WorkspaceHeader workspaceName={workspace.name} isAdmin={isAdmin}>
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
