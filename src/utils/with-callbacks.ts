// https://x.com/rwieruch/status/1897686642732785927
type ActionState = Partial<{
  status: 'success' | 'error'
  initialValue: unknown
}>

type Callbacks<T, R = unknown> = {
  onStart?: () => R
  onEnd?: (reference: R) => void
  onSuccess?: (result: T) => void
  onError?: (result: T) => void
}

export const withCallbacks = <
  Args extends unknown[],
  T extends ActionState,
  R = unknown,
>(
  fn: (...args: Args) => Promise<T>,
  callbacks: Callbacks<T, R>,
) => {
  return async (...args: Args) => {
    const promise = fn(...args)

    const reference = callbacks.onStart?.()

    if (reference) {
      callbacks.onEnd?.(reference)
    }

    const result = await promise

    if (result.status === 'success') {
      callbacks.onSuccess?.(result)
    }

    if (result.status === 'error') {
      callbacks.onError?.(result)
    }

    return result
  }
}
