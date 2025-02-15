import type { ReactNode } from 'react'

const WorkspaceIdLayout = ({
  children,
  toolbar,
}: { children: ReactNode; toolbar: ReactNode }) => {
  return (
    <div className="h-full">
      {toolbar}
      {children}
    </div>
  )
}

export default WorkspaceIdLayout
