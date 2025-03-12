'use client'

import { Menu } from '@/components/justd/ui'
import { InviteModal } from '@/features/workspaces/components/invite-modal'
import { PreferencesModal } from '@/features/workspaces/components/preferences-modal'
import type { Workspace } from '@/features/workspaces/types'
import { IconChevronDown } from 'justd-icons'
import { type ReactNode, useState } from 'react'

type WorkspaceHeaderProps = {
  workspaceName: Workspace['name']
  workspaceJoinCode: Workspace['joinCode']
  isAdmin: boolean
  children: ReactNode
}

export const WorkspaceHeader = ({
  workspaceName,
  workspaceJoinCode,
  isAdmin,
  children,
}: WorkspaceHeaderProps) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        workspaceName={workspaceName}
        workspaceJoinCode={workspaceJoinCode}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        workspaceName={workspaceName}
      />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <Menu>
          <Menu.Trigger className="truncate">
            <div className="flex items-center bg-transparent hover:bg-neutral-200/60 outline-none border-none font-semibold text-white text-lg w-auto p-1.5 overflow-hidden rounded-md cursor-pointer">
              <span className="truncate">{workspaceName}</span>
              <IconChevronDown className="size-4 ml-1 shrink-0" />
            </div>
          </Menu.Trigger>
          <Menu.Content placement="bottom start" className="w-64">
            <Menu.Item className="cursor-pointer capitalize flex items-center gap-1">
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                {workspaceName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-flex-col items-start">
                <p className="font-bold">{workspaceName}</p>
                <p className="text-xs text-muted-fg">Active workspace</p>
              </div>
            </Menu.Item>
            {isAdmin && (
              <>
                <Menu.Separator />
                <Menu.Item
                  onAction={() => setInviteOpen(true)}
                  className="cursor-pointer py-2"
                >
                  Invite people to {workspaceName}
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item
                  onAction={() => setPreferencesOpen(true)}
                  className="cursor-pointer py-2"
                >
                  Preference
                </Menu.Item>
              </>
            )}
          </Menu.Content>
        </Menu>
        {children}
      </div>
    </>
  )
}
