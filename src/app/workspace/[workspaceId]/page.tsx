import { getChannels } from '@/features/channels/server/fetcher'
import { getWorkspaceCurrentMember } from '@/features/members/server/fetcher'
import { WorkspaceIdPageClient } from '@/features/workspaces/components/workspace-id-page-client'
import { getSession } from '@/lib/auth/session'
import { IconTriangleExclamation } from 'justd-icons'
import { redirect } from 'next/navigation'

const WorkspaceIdPage = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params
  const session = await getSession()

  const workspaceCurrentMemberPromise = getWorkspaceCurrentMember({
    param: { workspaceId },
    userId: session?.user?.id,
  })

  const channelsPromise = getChannels({
    param: { workspaceId },
    userId: session?.user?.id,
  })

  const [workspaceCurrentMember, channels] = await Promise.all([
    workspaceCurrentMemberPromise,
    channelsPromise,
  ])

  if (channels.length > 0) {
    redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`)
  }

  if (workspaceCurrentMember.member?.role !== 'admin') {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <IconTriangleExclamation className="size-6 text-muted-foreground" />
        <span className="text-sm text-fg">No channel found</span>
      </div>
    )
  }

  return <WorkspaceIdPageClient />
}

export default WorkspaceIdPage
