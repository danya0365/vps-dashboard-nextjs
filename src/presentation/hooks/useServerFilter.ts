"use client";

import { VpsServer } from "@/src/application/repositories/IVpsRepository";
import { useMemo, useState } from "react";

type SortField = "name" | "status" | "provider" | "cpu" | "ram";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "running" | "stopped" | "error";

interface UseServerFilterOptions {
  servers: VpsServer[];
}

interface UseServerFilterReturn {
  filteredServers: VpsServer[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  providerFilter: string;
  setProviderFilter: (provider: string) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  providers: string[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * useServerFilter - Hook for filtering and sorting servers
 */
export function useServerFilter({ servers }: UseServerFilterOptions): UseServerFilterReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [providerFilter, setProviderFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Get unique providers
  const providers = useMemo(() => {
    return [...new Set(servers.map((s) => s.provider))];
  }, [servers]);

  // Apply filters and sorting
  const filteredServers = useMemo(() => {
    let result = [...servers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.hostname.toLowerCase().includes(query) ||
          s.ipAddress.includes(query) ||
          s.location.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }

    // Provider filter
    if (providerFilter) {
      result = result.filter((s) => s.provider === providerFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "provider":
          comparison = a.provider.localeCompare(b.provider);
          break;
        case "cpu":
          comparison = a.usage.cpuPercent - b.usage.cpuPercent;
          break;
        case "ram":
          comparison = a.usage.ramPercent - b.usage.ramPercent;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [servers, searchQuery, statusFilter, providerFilter, sortField, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setProviderFilter("");
    setSortField("name");
    setSortOrder("asc");
  };

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all" || providerFilter !== "";

  return {
    filteredServers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    providerFilter,
    setProviderFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    toggleSortOrder,
    providers,
    clearFilters,
    hasActiveFilters,
  };
}
