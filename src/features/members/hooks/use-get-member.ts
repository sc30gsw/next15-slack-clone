import { getMemberCacheKey } from '@/constants/cache-keys'
import { getMember } from '@/features/members/client/fetcher'
import { useQuery } from '@tanstack/react-query'

export const useGetMember = (memberId: string, userId?: string) => {
  const { isError, data, isLoading } = useQuery({
    queryKey: [getMemberCacheKey, memberId],
    queryFn: () => getMember({ param: { memberId }, userId }),
  })

  return {
    isError,
    data,
    isLoading,
  } as const
}
