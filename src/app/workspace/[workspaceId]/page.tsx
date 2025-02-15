const WorkspaceIdPage = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params

  return <div>{workspaceId}</div>
}

export default WorkspaceIdPage
