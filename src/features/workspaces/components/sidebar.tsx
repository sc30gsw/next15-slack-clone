import { Button, Loader } from '@/components/justd/ui'
import { UserButton } from '@/features/auth/components/user-button'
import { SidebarButton } from '@/features/workspaces/components/sidebar-button'
import { WorkspaceSwitcher } from '@/features/workspaces/components/workspace-switcher'
import {
  getWorkspace,
  getWorkspaces,
} from '@/features/workspaces/server/fetcher'
import { getSession } from '@/lib/auth/session'
import {
  IconBell,
  IconDotsHorizontal,
  IconHome,
  IconMessages,
} from 'justd-icons'
import { type FC, type SVGProps, Suspense } from 'react'

type SidebarProps = {
  workspaceId: string
}

export const Sidebar = async ({ workspaceId }: SidebarProps) => {
  const session = await getSession()

  const workspacesPromise = getWorkspaces(session?.user?.id)
  const workspacePromise = getWorkspace({
    param: { id: workspaceId },
    userId: session?.user?.id,
  })
  const workspacePromises = Promise.all([workspacesPromise, workspacePromise])

  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <Suspense
        fallback={
          <Button
            intent="secondary"
            className="size-9 relative overflow-hidden text-slate-800 font-semibold"
          >
            <Loader className="animate-spin" />
          </Button>
        }
      >
        <WorkspaceSwitcher workspacePromises={workspacePromises} />
      </Suspense>
      <SidebarButton icon={<SidebarIcon icon={IconHome} />} label="Home" />
      <SidebarButton icon={<SidebarIcon icon={IconMessages} />} label="DMs" />
      <SidebarButton icon={<SidebarIcon icon={IconBell} />} label="Activity" />
      <SidebarButton
        icon={<SidebarIcon icon={IconDotsHorizontal} />}
        label="More"
      />
      <nav className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </nav>
    </aside>
  )
}

const SidebarIcon = ({ icon: Icon }: { icon: FC<SVGProps<SVGSVGElement>> }) => {
  return (
    <Icon className="size-5 text-white group-hover:scale-110 transition-all" />
  )
}
