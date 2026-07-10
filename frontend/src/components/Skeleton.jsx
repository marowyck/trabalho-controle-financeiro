function SkeletonBlock({ className = '', style }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800 ${className}`}
      style={style}
    />
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="surface rounded-xl p-5">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="h-9 w-9 rounded-lg" />
          </div>
          <SkeletonBlock className="mt-4 h-7 w-32" />
          <SkeletonBlock className="mt-3 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 340 }) {
  return (
    <div className="surface rounded-xl p-6">
      <div className="mb-5 flex items-center gap-2">
        <SkeletonBlock className="h-4 w-4 rounded" />
        <SkeletonBlock className="h-4 w-40" />
      </div>
      <SkeletonBlock className="w-full rounded-lg" style={{ height }} />
    </div>
  );
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="surface overflow-hidden rounded-xl">
      <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <div className="grid grid-cols-6 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <SkeletonBlock key={i} className="h-3" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-4">
            <div className="grid grid-cols-6 items-center gap-4">
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-5 w-20 rounded-full" />
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-16" />
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-3 w-14 rounded-full" />
              </div>
            </div>
            <SkeletonBlock className="h-6 w-6 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
