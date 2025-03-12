import { getChannels } from '@/features/channels/server/fetcher'
import { WorkspaceIdPageClient } from '@/features/workspaces/components/workspace-id-page-client'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export const experimental_ppr = true

const WorkspaceIdPage = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params
  const session = await getSession()

  const channels = await getChannels({
    param: { workspaceId },
    userId: session?.user?.id,
  })

  if (channels.length > 0) {
    redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`)
  }

  return <WorkspaceIdPageClient />
}

export default WorkspaceIdPage
