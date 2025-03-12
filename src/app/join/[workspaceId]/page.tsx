import { Button } from '@/components/justd/ui'
import { JoinVerificationInput } from '@/features/join/components/join-verification-input'
import { getWorkspaceInfo } from '@/features/join/server/fetcher'
import { getSession } from '@/lib/auth/session'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const JoinPage = async ({
  params,
}: { params: Promise<{ workspaceId: string }> }) => {
  const { workspaceId } = await params

  const session = await getSession()
  const workspaceInfo = await getWorkspaceInfo({
    param: { id: workspaceId },
    userId: session?.user?.id,
  })

  if (workspaceInfo.isMember) {
    redirect(`/workspace/${workspaceId}`)
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-sm">
      <Image
        src="/logo.svg"
        width={60}
        height={60}
        alt="Logo"
        priority={true}
      />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {workspaceInfo.name}</h1>

          <p className="text-md text-muted-fg">
            Enter the workspace code to join
          </p>
        </div>
        <JoinVerificationInput />
      </div>
      <div className="flex gap-x-4">
        <Button size="large" intent="outline">
          <Link href={'/'}>Back to home</Link>
        </Button>
      </div>
    </div>
  )
}

export default JoinPage
