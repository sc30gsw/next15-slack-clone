'use client'

import { Avatar, Separator, Skeleton } from '@/components/justd/ui'
import { useGetMember } from '@/features/members/hooks/use-get-member'
import { useProfileMemberId } from '@/features/members/hooks/user-profile-member-id'
import { IconMail, IconTriangleExclamation } from 'justd-icons'
import Link from 'next/link'

export const ProfileContent = ({
  userId,
}: Partial<Record<'userId', string>>) => {
  const { profileMemberId } = useProfileMemberId()
  const {
    isLoading,
    isError,
    data: member,
  } = useGetMember(profileMemberId, userId)

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center p-4">
          <Skeleton className="w-63.5 h-63.5" />
        </div>
        <div className="flex flex-col p-4">
          <Skeleton className="h-7 w-40" />
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <IconMail className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-muted-fg">
                Email Address
              </p>
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </div>
      </>
    )
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
