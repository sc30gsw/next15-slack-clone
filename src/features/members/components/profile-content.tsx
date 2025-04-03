'use client'

import { Avatar, Separator } from '@/components/justd/ui'
import { MemberOperateForm } from '@/features/members/components/member-operate-form'
import { ProfileLoading } from '@/features/members/components/profile-loading'
import { useGetMember } from '@/features/members/hooks/use-get-member'
import { useProfileMemberId } from '@/features/members/hooks/user-profile-member-id'
import type { client } from '@/lib/rpc'
import type { InferResponseType } from 'hono'
import { IconMail, IconTriangleExclamation } from 'justd-icons'
import Link from 'next/link'

type ProfileContentProps = {
  userId?: string
  currentMember: InferResponseType<
    (typeof client.api.members)[':workspaceId']['current-member']['$get'],
    200
  >['member']
  workspaceId: string
}

export const ProfileContent = ({
  userId,
  currentMember,
  workspaceId,
}: ProfileContentProps) => {
  const { profileMemberId } = useProfileMemberId()
  const {
    isLoading,
    isError,
    data: member,
  } = useGetMember({ workspaceId, memberId: profileMemberId }, userId)

  if (isLoading) {
    return <ProfileLoading />
  }

  if (isError || !member) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <IconTriangleExclamation className="size-5 text-muted-fg" />
        <p className="text-sm text-muted-fg">Profile not found</p>
      </div>
    )
  }

  const avatarFallback = member.user?.name?.charAt(0).toUpperCase() || 'M'

  return (
    <>
      <div className="flex flex-col items-center justify-center p-4">
        <Avatar
          alt={member.user?.name ?? 'Member'}
          shape="square"
          size="super-large"
          src={member.user?.image}
          initials={avatarFallback}
          className="bg-sky-500 text-white"
        />
      </div>
      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">{member.user?.name}</p>
        {currentMember?.role === 'admin' &&
        currentMember.userId !== member.userId ? (
          <MemberOperateForm
            memberId={member.userId}
            role={member.role}
            workspaceId={workspaceId}
          />
        ) : currentMember?.userId === member.userId &&
          currentMember.role !== 'admin' ? (
          <MemberOperateForm
            memberId={member.userId}
            role={member.role}
            workspaceId={workspaceId}
            variant="leave"
          />
        ) : null}
      </div>
      <Separator />
      <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact information</p>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <IconMail className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-muted-fg">Email Address</p>
            <Link
              href={`mailto:${member.user?.email}`}
              className="text-sm hover:underline text-[#1264a3]"
            >
              {member.user?.email}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
