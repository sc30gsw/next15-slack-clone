import { Toolbar } from '@/features/workspaces/components/toolbar'

const ToolbarPage = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params

  return <Toolbar workspaceId={workspaceId} />
}

export default ToolbarPage
