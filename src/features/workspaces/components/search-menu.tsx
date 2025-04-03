'use client'

import { Button } from '@/components/justd/ui'
import { CommandMenu } from '@/components/justd/ui/command-menu'
import type { client } from '@/lib/rpc'
import type { InferResponseType } from 'hono'
import Link from 'next/link'
import { type ReactNode, useState, useTransition } from 'react'

type SearchMenuProps = {
  children: ReactNode
  channels: InferResponseType<
    (typeof client.api.channels)[':workspaceId']['$get']
  >['channels']
  members: InferResponseType<
    (typeof client.api.members)[':workspaceId']['$get']
  >['members']
  workspaceId: string
}

export const SearchMenu = ({
  children,
  channels,
  members,
  workspaceId,
}: SearchMenuProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [results, result] = useState([...channels, ...members])

  const handleSearch = (value: string) => {
    setSearch(value)

    startTransition(async () => {
      const channelResult = channels.filter((channel) =>
        channel.name.toLowerCase().includes(value.toLowerCase()),
      )
      const memberResult = members.filter((member) =>
        member.user?.name?.toLowerCase().includes(value.toLowerCase()),
      )

      result([...channelResult, ...memberResult])
    })
  }

  return (
    <div className="min-w-[280px] max-[642px] grow-[2] shrink">
      <Button
        size="small"
        onPress={() => setOpen(true)}
        className="bg-secondary/25 hover:bg-secondary-25 data-hovered:bg-secondary-25 data-pressed:bg-secondary-25 w-full h-7 justify-start px-2"
      >
        {children}
      </Button>
      <CommandMenu
        isPending={isPending}
        onInputChange={handleSearch}
        inputValue={search}
        isOpen={open}
        onOpenChange={setOpen}
      >
        <CommandMenu.Search placeholder="Type a command or search..." />
        <CommandMenu.List items={results}>
          <CommandMenu.Section title="Channels">
            {channels.map((channel) => (
              <CommandMenu.Item
                textValue={channel.name}
                key={channel.id}
                onAction={() => setOpen(false)}
              >
                <Link href={`/workspace/${workspaceId}/channel/${channel.id}`}>
                  {channel.name}
                </Link>
              </CommandMenu.Item>
            ))}
          </CommandMenu.Section>

          <CommandMenu.Section title="Members">
            {members.map((member) => (
              <CommandMenu.Item
                textValue={member.user?.name ?? ''}
                key={member.userId}
                onAction={() => setOpen(false)}
              >
                <Link
                  href={`/workspace/${workspaceId}/member/${member.userId}`}
                >
                  {member.user?.name}
                </Link>
              </CommandMenu.Item>
            ))}
          </CommandMenu.Section>
        </CommandMenu.List>
      </CommandMenu>
    </div>
  )
}
