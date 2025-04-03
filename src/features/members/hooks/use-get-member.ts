import { getMemberCacheKey } from '@/constants/cache-keys'
import { getMember } from '@/features/members/client/fetcher'
import { useQuery } from '@tanstack/react-query'

export const useGetMember = (
  param: Record<'workspaceId' | 'memberId', string>,
  userId?: string,
) => {
  const { isError, data, isLoading } = useQuery({
    queryKey: [getMemberCacheKey, param.memberId, param.workspaceId],
    queryFn: () => getMember({ param, userId }),
  })

  return {
    isError,
    data,
    isLoading,
  } as const
}
