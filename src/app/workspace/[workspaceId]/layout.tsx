import { CreateWorkSpaceModal } from '@/features/workspaces/components/crete-workspace-modal'
import type { ReactNode } from 'react'

const WorkspaceIdLayout = ({
  children,
  toolbar,
  sidebar,
}: { children: ReactNode; toolbar: ReactNode; sidebar: ReactNode }) => {
  return (
    <div className="h-full">
      {toolbar}
      <section className="flex h-[calc(100vh-40px)]">
        {sidebar}
        {children}
      </section>
      <CreateWorkSpaceModal />
    </div>
  )
}

export default WorkspaceIdLayout
