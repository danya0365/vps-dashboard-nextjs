"use client";

import { AnimatedButton } from "./AnimatedButton";

interface ServerFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | "running" | "stopped" | "error";
  onStatusChange: (status: "all" | "running" | "stopped" | "error") => void;
  providerFilter: string;
  onProviderChange: (provider: string) => void;
  providers: string[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
}

/**
 * ServerFilterBar - Search and filter controls for server list
 */
export function ServerFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  providerFilter,
  onProviderChange,
  providers,
  hasActiveFilters,
  onClearFilters,
  resultCount,
  totalCount,
}: ServerFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
      {/* Search input */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search servers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 
                     border border-gray-200/50 dark:border-gray-700/50 
                     text-gray-800 dark:text-white placeholder-gray-400
                     focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                     transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as "all" | "running" | "stopped" | "error")}
          className="px-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 
                     border border-gray-200/50 dark:border-gray-700/50 
                     text-sm font-medium text-gray-700 dark:text-gray-300
                     focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="running">🟢 Running</option>
          <option value="stopped">⏸️ Stopped</option>
          <option value="error">🔴 Error</option>
        </select>

        {/* Provider filter */}
        <select
          value={providerFilter}
          onChange={(e) => onProviderChange(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 
                     border border-gray-200/50 dark:border-gray-700/50 
                     text-sm font-medium text-gray-700 dark:text-gray-300
                     focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer"
        >
          <option value="">All Providers</option>
          {providers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <AnimatedButton variant="ghost" size="sm" onClick={onClearFilters}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </AnimatedButton>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {resultCount === totalCount ? (
          <span>{totalCount} servers</span>
        ) : (
          <span>
            {resultCount} of {totalCount}
          </span>
        )}
      </div>
    </div>
  );
}
