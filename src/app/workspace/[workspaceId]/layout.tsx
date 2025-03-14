'use client'

import type { ReactNode } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

const WorkspaceIdLayout = ({
  children,
  toolbar,
  sidebar,
  workspaceSidebar,
}: {
  children: ReactNode
  toolbar: ReactNode
  sidebar: ReactNode
  workspaceSidebar: ReactNode
}) => {
  return (
    <div className="h-full">
      {toolbar}
      <section className="flex h-[calc(100vh-40px)]">
        {sidebar}
        <PanelGroup direction="horizontal" autoSaveId="ca-workspace-layout">
          <Panel defaultSize={20} minSize={11} className="bg-[#5E2C5F]">
            {workspaceSidebar}
          </Panel>
          <PanelResizeHandle />
          <Panel minSize={20}>{children}</Panel>
        </PanelGroup>
      </section>
    </div>
  )
}

export default WorkspaceIdLayout
