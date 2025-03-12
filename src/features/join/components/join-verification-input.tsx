'use client'

import { joinAction } from '@/features/join/actions/join-action'
import { cn } from '@/utils/classes'
import { useParams, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import VerificationInput from 'react-verification-input'
import { toast } from 'sonner'

export const JoinVerificationInput = () => {
  const params = useParams<Record<'workspaceId', string>>()
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const handleComplete = (value: string) => {
    startTransition(async () => {
      try {
        await joinAction(params.workspaceId, value)
        toast.success('Joined workspace')
        router.replace(`/workspace/${params.workspaceId}`)
      } catch (_) {
        toast.error('Failed to join workspace')
      }
    })
  }

  return (
    <VerificationInput
      length={6}
      autoFocus={true}
      onComplete={handleComplete}
      classNames={{
        container: cn(
          'flex gap-x-2',
          isPending && 'opacity-50 cursor-not-allowed',
        ),
        character:
          'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
        characterInactive: 'bg-muted',
        characterSelected: 'bg-white text-black',
        characterFilled: 'bg-white text-black',
      }}
    />
  )
}
