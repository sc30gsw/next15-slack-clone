'use client'

import { Button, Menu } from '@/components/justd/ui'
import { Hint } from '@/components/ui/hint'
import type { Workspace } from '@/features/workspaces/types'
import { IconChevronDown, IconFilter2, IconPencilBox } from 'justd-icons'

type WorkspaceHeaderProps = {
  workspaceName: Workspace['name']
  isAdmin: boolean
}

export const WorkspaceHeader = ({
  workspaceName,
  isAdmin,
}: WorkspaceHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
      <Menu>
        <Menu.Trigger>
          <Button
            intent="transparent"
            size="small"
            className="font-semibold text-white text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-200/60 data-pressed:bg-neutral-200/60"
          >
            <span className="truncate">{workspaceName}</span>
            <IconChevronDown className="size-4 ml-1 shrink-0" />
          </Button>
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
              <Menu.Item className="cursor-pointer py-2">
                Invite people to {workspaceName}
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item className="cursor-pointer py-2">Preference</Menu.Item>
            </>
          )}
        </Menu.Content>
      </Menu>
      <div className="flex items-center gap-0.5">
        <Hint label="Search" placement="bottom" showArrow={false}>
          <Button
            intent="transparent"
            size="square-petite"
            appearance="outline"
            className="font-semibold text-white text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-200/60 data-pressed:bg-neutral-200/60"
          >
            <IconFilter2 className="size-4" />
          </Button>
        </Hint>
        <Hint label="New message" placement="bottom" showArrow={false}>
          <Button
            intent="transparent"
            size="square-petite"
            appearance="outline"
            className="font-semibold text-white text-lg w-auto p-1.5 overflow-hidden data-hovered:bg-neutral-200/60 data-pressed:bg-neutral-200/60"
          >
            <IconPencilBox className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  )
}
