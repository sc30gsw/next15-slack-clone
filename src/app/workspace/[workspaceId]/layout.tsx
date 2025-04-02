'use client'
import { ResizableHandle } from '@/components/ui/resizable'
import { usePanel } from '@/hooks/use-panel'
import type { ReactNode } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'

const WorkspaceIdLayout = ({
  children,
  toolbar,
  sidebar,
  workspaceSidebar,
  thread,
}: {
  children: ReactNode
  toolbar: ReactNode
  sidebar: ReactNode
  workspaceSidebar: ReactNode
  thread: ReactNode
}) => {
  const { parentMessageId } = usePanel()

  const showPanel = !!parentMessageId

  return (
    <div className="h-full">
      {toolbar}
      <section className="flex h-[calc(100vh-40px)]">
        {sidebar}
        <PanelGroup direction="horizontal" autoSaveId="ca-workspace-layout">
          <Panel defaultSize={20} minSize={11} className="bg-[#5E2C5F]">
            {workspaceSidebar}
          </Panel>
          <ResizableHandle withHandle={true} />
          <Panel minSize={20}>{children}</Panel>
          {showPanel && (
            <>
              <ResizableHandle withHandle={true} />
              <Panel minSize={20} defaultSize={29}>
                {thread}
              </Panel>
            </>
          )}
        </PanelGroup>
      </section>
    </div>
  )
}

export default WorkspaceIdLayout
