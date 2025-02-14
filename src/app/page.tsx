import { UserButton } from '@/features/auth/components/user-button'

// const getTasks = async () => {
//   const url = client.api.tasks.$url()
//   type ResType = InferResponseType<typeof client.api.tasks.$get>

//   const res = await fetcher<ResType>(url, {
//     cache: 'force-cache',
//   })

//   return res
// }

const Home = () => {
  return (
    <>
      <UserButton />
    </>
  )
}

export default Home
