'use client'

import {
  Button,
  Form,
  Loader,
  Separator,
  TextField,
} from '@/components/justd/ui'
import { OauthButton } from '@/features/auth/components/oauth-button'
import { useOauthSignIn } from '@/features/auth/hooks/use-oauth-sign-in'
import { useSignUp } from '@/features/auth/hooks/use-sign-up'
import { getFormProps, getInputProps } from '@conform-to/react'
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconTriangleExclamation,
} from 'justd-icons'
import { Fragment } from 'react'

export const SignUpForm = () => {
  const { form, action, lastResult, isPending, fields } = useSignUp()
  const { isPending: isOauthPending, action: oauthAction } = useOauthSignIn()

  const getError = () => {
    if (lastResult?.error && Array.isArray(lastResult.error.message)) {
      return lastResult.error.message.join(', ')
    }

    return
  }

  return (
    <>
      <Form {...getFormProps(form)} action={action} className="space-y-2.5">
        {getError() && (
          <div className="bg-danger/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-danger mb-6">
            <IconTriangleExclamation className="size-4" />
            <p>{getError()}</p>
          </div>
        )}

        <div>
          <TextField
            {...getInputProps(fields.name, { type: 'text' })}
            placeholder="Full name"
            defaultValue={lastResult?.initialValue?.name.toString() ?? ''}
            isDisabled={isPending || isOauthPending}
            errorMessage={''}
          />
          <span id={fields.name.errorId} className="text-sm text-red-500">
            {fields.name.errors}
          </span>
        </div>
        <div>
          <TextField
            {...getInputProps(fields.email, { type: 'email' })}
            placeholder="Email"
            defaultValue={lastResult?.initialValue?.email.toString() ?? ''}
            isDisabled={isPending || isOauthPending}
            errorMessage={''}
          />
          <span id={fields.email.errorId} className="text-sm text-red-500">
            {fields.email.errors}
          </span>
        </div>
        <div>
          <TextField
            {...getInputProps(fields.password, { type: 'password' })}
            placeholder="Password"
            defaultValue={lastResult?.initialValue?.password.toString() ?? ''}
            isDisabled={isPending || isOauthPending}
            errorMessage={''}
          />
          <span id={fields.password.errorId} className="text-sm text-red-500">
            {fields.password.errors && fields.password.errors?.length > 1
              ? fields.password.errors.map((error) => (
                  <Fragment key={crypto.randomUUID()}>
                    {error}
                    <br />
                  </Fragment>
                ))
              : fields.password.errors}
          </span>
        </div>
        <div>
          <TextField
            {...getInputProps(fields.passwordConfirmation, {
              type: 'password',
            })}
            placeholder="Password Confirmation"
            defaultValue={
              lastResult?.initialValue?.passwordConfirmation.toString() ?? ''
            }
            isDisabled={isPending || isOauthPending}
            errorMessage={''}
          />
          <span
            id={fields.passwordConfirmation.errorId}
            className="text-sm text-red-500"
          >
            {fields.passwordConfirmation.errors &&
            fields.passwordConfirmation.errors?.length > 1
              ? fields.passwordConfirmation.errors.map((error) => (
                  <Fragment key={error}>
                    {error}
                    <br />
                  </Fragment>
                ))
              : fields.passwordConfirmation.errors}
          </span>
        </div>
        <Button
          type="submit"
          intent="secondary"
          size="large"
          isDisabled={isPending || isOauthPending}
          className="w-full text-white bg-zinc-900 hover:bg-zinc-950 data-hovered:bg-zinc-800/90 data-pressed:bg-zinc-800/90 relative"
        >
          Continue
          {isPending && <Loader className="absolute top-3 right-3" />}
        </Button>
      </Form>
      <Separator />
      <div className="flex flex-col gap-y-2.5">
        <OauthButton
          isDisabled={isOauthPending}
          isPending={isPending}
          onClick={() => oauthAction('github')}
          icon={IconBrandGithub}
          label="Continue with Github"
        />
        <OauthButton
          isDisabled={isOauthPending}
          isPending={isPending}
          onClick={() => oauthAction('google')}
          icon={IconBrandGoogle}
          label="Continue with Github"
        />
      </div>
    </>
  )
}
