import { Sidebar } from '@/features/workspaces/components/sidebar'

const WorkspaceIdSidebarPage = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params

  return <Sidebar workspaceId={workspaceId} />
}

export default WorkspaceIdSidebarPage
