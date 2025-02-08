'use client'

import { Card } from '@/components/justd/ui'
import { SignUpForm } from '@/features/auth/components/sign-up-form'
import Link from 'next/link'

export const SignUpCard = () => {
  return (
    <Card className="w-full h-full p-8">
      <Card.Header className="px-0 pt-0">
        <Card.Title>Sign up to continue</Card.Title>
        <Card.Description>
          Use your email or another service to continue
        </Card.Description>
      </Card.Header>

      <Card.Content className="space-y-5 px-0 pb-0">
        <SignUpForm />
        <p className="text-xs text-muted-foreground">
          Already have an account?
          <Link
            href={'/sign-in'}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign In
          </Link>
        </p>
      </Card.Content>
    </Card>
  )
}
