import { UserButton } from '@/features/auth/components/user-button'
import { CreateWorkSpaceModal } from '@/features/workspaces/components/crete-workspace-modal'

const Home = () => {
  return (
    <>
      <UserButton />
      <CreateWorkSpaceModal />
    </>
  )
}

export default Home
