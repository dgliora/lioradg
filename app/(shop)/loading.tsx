import { Skeleton } from '@/components/ui'

export default function ShopLoading() {
  return (
    <div className="min-h-[60vh] bg-warm-50">
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-5 w-48 mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-warm-100 bg-white">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="p-3 sm:p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-20 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
