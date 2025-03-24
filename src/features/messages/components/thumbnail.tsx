'use client'

import { Modal } from '@/components/justd/ui'
import Image from 'next/image'

export const Thumbnail = ({
  url,
}: Record<'url', string | null | undefined>) => {
  if (!url) {
    return null
  }

  return (
    <Modal>
      <Modal.Trigger>
        <div className="relative overflow-hidden max-w-90 border rounded-lg my-2 cursor-zoom-in">
          <Image
            src={url}
            alt="Message image"
            height={100}
            width={100}
            className="rounded-md object-cover size-full"
          />
        </div>
      </Modal.Trigger>
      <Modal.Content
        classNames={{
          content: 'max-w-100 border-none bg-transparent p-0 shadow-none',
        }}
      >
        <Image
          src={url}
          alt="Message image"
          height={100}
          width={100}
          className="rounded-md object-cover size-full"
        />
      </Modal.Content>
    </Modal>
  )
}
