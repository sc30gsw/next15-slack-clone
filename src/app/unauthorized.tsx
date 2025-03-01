import Link from 'next/link'

const UnauthorizedPage = () => {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Link href={'/sign-in'}>Sign in</Link>
    </main>
  )
}

export default UnauthorizedPage
