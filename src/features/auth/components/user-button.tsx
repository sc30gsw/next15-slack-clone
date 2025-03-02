'use client'

import { Avatar, Menu, Skeleton } from '@/components/justd/ui'
import { signOutAction } from '@/features/auth/actions/sign-out-action'
import {
  IconDashboard,
  IconDeviceDesktop,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from 'justd-icons'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'

export const UserButton = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const { data: session, status } = useSession()

  if (status === 'loading' || !session) {
    return (
      <Skeleton
        intent="lighter"
        shape="circle"
        className="size-10 bg-zinc-400/40"
      />
    )
  }

  return (
    <Menu>
      <Menu.Trigger aria-label="Open Menu" className="outline-none relative">
        <Avatar
          alt={session.user?.name ?? 'User'}
          size="large"
          src={session.user?.image}
          initials={session.user?.name?.charAt(0).toUpperCase()}
          className="hover:opacity-75 transition cursor-pointer bg-sky-500 text-white"
        />
      </Menu.Trigger>
      <Menu.Content placement="right" showArrow={true} className="w-60">
        <Menu.Header separator={true}>
          <span className="block">{session.user?.name}</span>
          <span className="font-normal text-muted-fg">
            @{session.user?.id?.slice(0, 12)}
          </span>
        </Menu.Header>

        <Menu.Section>
          <Menu.Item href="#dashboard">
            <IconDashboard />
            <Menu.Label>Dashboard</Menu.Label>
          </Menu.Item>
          <Menu.Item href="#settings">
            <IconSettings />
            <Menu.Label>Settings</Menu.Label>
          </Menu.Item>
        </Menu.Section>
        <Menu.Separator />
        <Menu.Submenu>
          <Menu.Item>
            {resolvedTheme === 'light' ? (
              <IconSun />
            ) : resolvedTheme === 'dark' ? (
              <IconMoon />
            ) : (
              <IconDeviceDesktop />
            )}
            <Menu.Label>Switch theme</Menu.Label>
          </Menu.Item>
          <Menu.Content>
            <Menu.Item onAction={() => setTheme('system')}>
              <IconDeviceDesktop /> System
            </Menu.Item>
            <Menu.Item onAction={() => setTheme('dark')}>
              <IconMoon /> Dark
            </Menu.Item>
            <Menu.Item onAction={() => setTheme('light')}>
              <IconSun /> Light
            </Menu.Item>
          </Menu.Content>
        </Menu.Submenu>

        <Menu.Separator />
        <Menu.Item onAction={() => signOutAction()}>
          <IconLogout />
          <Menu.Label>Log out</Menu.Label>
        </Menu.Item>
      </Menu.Content>
    </Menu>
  )
}
