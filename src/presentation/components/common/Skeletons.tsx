"use client";

/**
 * ServerCardSkeleton - Loading skeleton for ServerCard
 */
export function ServerCardSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-5 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Info row skeleton */}
      <div className="flex gap-4 mb-4">
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
      </div>

      {/* Specs skeleton */}
      <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-2 w-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-3 w-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Usage bars skeleton */}
      <div className="space-y-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="w-8 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Actions skeleton */}
      <div className="flex gap-2">
        <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="w-10 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * StatCardSkeleton - Loading skeleton for stat cards
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
        <div>
          <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * DashboardSkeleton - Full dashboard loading skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Resource summary skeleton */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Server grid skeleton */}
      <div>
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <ServerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
