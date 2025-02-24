import { WorkspaceSidebar } from '@/features/workspaces/components/workspace-sidebar'

const workspaceSidebarPage = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params

  return <WorkspaceSidebar workspaceId={workspaceId} />
}

export default workspaceSidebarPage
