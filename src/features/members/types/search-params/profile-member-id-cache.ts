import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const profileMemberIdParsers = {
  profileMemberId: parseAsString
    .withDefault('')
    .withOptions({ shallow: true, history: 'push' }),
}

export const profileMemberIdCache = createSearchParamsCache(
  profileMemberIdParsers,
)
