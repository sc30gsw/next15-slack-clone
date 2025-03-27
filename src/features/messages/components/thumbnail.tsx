'use client'

import { Modal } from '@/components/justd/ui'
import type { JSX, ReactNode } from 'react'

type ThumbnailProps = {
  children: ReactNode
  modalContentImage: JSX.Element
}

export const Thumbnail = ({ children, modalContentImage }: ThumbnailProps) => {
  return (
    <Modal>
      <Modal.Trigger>
        <div className="relative overflow-hidden max-w-90 border rounded-lg my-2 cursor-zoom-in">
          {children}
        </div>
      </Modal.Trigger>
      <Modal.Content
        classNames={{
          content: 'max-w-100 border-none bg-transparent p-0 shadow-none',
        }}
      >
        {modalContentImage}
      </Modal.Content>
    </Modal>
  )
}
