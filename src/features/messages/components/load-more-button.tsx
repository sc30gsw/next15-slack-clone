import { Loader, Skeleton } from '@/components/justd/ui'

type LoadMoreButtonProps = {
  context: {
    loadMore: () => void
    loading: boolean
    canLoadMore: boolean
  }
}

export const LoadMoreButton = ({
  context: { loadMore, loading, canLoadMore },
}: LoadMoreButtonProps) => {
  return (
    <>
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore()
                }
              },
              { threshold: 1.0 },
            )

            observer.observe(el)

            return () => observer.disconnect()
          }
        }}
      />
      {loading && (
        <>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader
                size="medium"
                intent="secondary"
                className="animate-spin"
              />
            </span>
          </div>
          <div className="flex flex-col gap-y-4 p-1.5 px-5">
            {Array.from({ length: 2 }).map(() => (
              <div key={crypto.randomUUID()}>
                <div className="flex items-start gap-2">
                  <Skeleton className="size-6" />
                  <Skeleton className="h-4 w-25" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <div className="flex flex-col gap-y-1.5 ml-8">
                  <Skeleton className="h-3 w-2/5" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
