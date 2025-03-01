import { Sidebar } from '@/features/workspaces/components/sidebar'

export const experimental_ppr = true

const WorkspaceIdSidebarDefault = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params

  return <Sidebar workspaceId={workspaceId} />
}

export default WorkspaceIdSidebarDefault
