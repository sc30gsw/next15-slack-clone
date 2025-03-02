import { WorkspaceSidebar } from '@/features/workspaces/components/workspace-sidebar'

export const experimental_ppr = true

const WorkspaceSidebarDefault = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params

  return <WorkspaceSidebar workspaceId={workspaceId} />
}

export default WorkspaceSidebarDefault
