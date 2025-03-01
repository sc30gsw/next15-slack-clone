import { Toolbar } from '@/features/workspaces/components/toolbar'

export const experimental_ppr = true

const WorkspaceIdToolbarDefault = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params

  return <Toolbar workspaceId={workspaceId} />
}

export default WorkspaceIdToolbarDefault
