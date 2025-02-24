'use client'

import { Button, Menu } from '@/components/justd/ui'
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal'
import type { Workspace, Workspaces } from '@/features/workspaces/types'
import { IconSquarePlus } from 'justd-icons'
import { useRouter } from 'next/navigation'
import { use } from 'react'

type WorkspaceSwitcherProps = {
  workspacesPromise: Promise<Workspaces>
  workspacePromise: Promise<Workspace>
}

export const WorkspaceSwitcher = ({
  workspacesPromise,
  workspacePromise,
}: WorkspaceSwitcherProps) => {
  const workspaces = use(workspacesPromise)
  const workspace = use(workspacePromise)

  const filteredWorkspaces = workspaces.filter(
    (item) => item.id !== workspace.id,
  )

  const router = useRouter()

  const [_, setOpen] = useCreateWorkspaceModal()

  return (
    <Menu>
      <Menu.Trigger>
        <Button
          intent="secondary"
          className="size-9 relative overflow-hidden text-slate-800 font-semibold"
        >
          {workspace.name.charAt(0).toUpperCase()}
        </Button>
      </Menu.Trigger>
      <Menu.Content placement="bottom start" className="w-64">
        <Menu.Item
          onAction={() => router.push(`/workspace/${workspace.id}`)}
          className="cursor-pointer"
        >
          <div className="flex flex-col items-start justify-start">
            <p className="truncate">{workspace.name}</p>
            <span className="text-sm text-muted-fg">Active Workspace</span>
          </div>
        </Menu.Item>
        {filteredWorkspaces.map((workspace) => (
          <Menu.Item
            key={workspace.id}
            onAction={() => router.push(`/workspace/${workspace.id}`)}
            className="cursor-pointer capitalize"
          >
            <div className="flex items-center gap-x-2">
              <p className="shrink-0 size-9 relative bg-[#616061] text-white font-semibold rounded-md flex items-center justify-center">
                {workspace.name.charAt(0).toUpperCase()}{' '}
              </p>
              <p className="truncate max-w-46">{workspace.name}</p>
            </div>
          </Menu.Item>
        ))}
        <Menu.Item
          onAction={() => setOpen(true)}
          className={'flex items-center gap-x-2 cursor-pointer'}
        >
          <div className="size-9 relative overflow-hidden  text-slate-800 font-semibold rounded-md flex items-center justify-center">
            <IconSquarePlus className="size-full" />
          </div>
          Create a new workspace
        </Menu.Item>
      </Menu.Content>
    </Menu>
  )
}
