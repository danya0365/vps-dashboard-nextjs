"use client";

import { VpsServer } from "@/src/application/repositories/IVpsRepository";
import { MockVpsRepository } from "@/src/infrastructure/repositories/mock/MockVpsRepository";
import { useCallback, useMemo, useState } from "react";
import { DashboardPresenter, DashboardViewModel } from "./DashboardPresenter";

export interface DashboardState {
  viewModel: DashboardViewModel | null;
  loading: boolean;
  actionLoading: string | null; // server ID being acted upon
  error: string | null;
}

export interface DashboardActions {
  startServer: (id: string) => Promise<void>;
  stopServer: (id: string) => Promise<void>;
  restartServer: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

/**
 * useDashboardPresenter - Client-side hook for dashboard interactions
 */
export function useDashboardPresenter(
  initialViewModel: DashboardViewModel
): [DashboardState, DashboardActions] {
  const [viewModel, setViewModel] = useState<DashboardViewModel>(initialViewModel);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create presenter instance
  const presenter = useMemo(() => {
    const repository = new MockVpsRepository();
    return new DashboardPresenter(repository);
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newViewModel = await presenter.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      setError("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  // Update server in local state
  const updateServerInState = useCallback((updatedServer: VpsServer) => {
    setViewModel((prev) => {
      if (!prev) return prev;
      const updatedServers = prev.servers.map((s) =>
        s.id === updatedServer.id ? updatedServer : s
      );
      // Recalculate stats
      const runningServers = updatedServers.filter((s) => s.status === "running");
      const stats = {
        ...prev.stats,
        runningServers: runningServers.length,
        stoppedServers: updatedServers.filter((s) => s.status === "stopped").length,
        errorServers: updatedServers.filter((s) => s.status === "error").length,
        avgCpuUsage:
          runningServers.length > 0
            ? Math.round(
                runningServers.reduce((acc, s) => acc + s.usage.cpuPercent, 0) /
                  runningServers.length
              )
            : 0,
        avgRamUsage:
          runningServers.length > 0
            ? Math.round(
                runningServers.reduce((acc, s) => acc + s.usage.ramPercent, 0) /
                  runningServers.length
              )
            : 0,
      };
      return { servers: updatedServers, stats };
    });
  }, []);

  // Start server
  const startServer = useCallback(
    async (id: string) => {
      setActionLoading(id);
      setError(null);
      try {
        const updatedServer = await presenter.startServer(id);
        updateServerInState(updatedServer);
      } catch (err) {
        setError(`Failed to start server ${id}`);
      } finally {
        setActionLoading(null);
      }
    },
    [presenter, updateServerInState]
  );

  // Stop server
  const stopServer = useCallback(
    async (id: string) => {
      setActionLoading(id);
      setError(null);
      try {
        const updatedServer = await presenter.stopServer(id);
        updateServerInState(updatedServer);
      } catch (err) {
        setError(`Failed to stop server ${id}`);
      } finally {
        setActionLoading(null);
      }
    },
    [presenter, updateServerInState]
  );

  // Restart server
  const restartServer = useCallback(
    async (id: string) => {
      setActionLoading(id);
      setError(null);
      try {
        const updatedServer = await presenter.restartServer(id);
        updateServerInState(updatedServer);
      } catch (err) {
        setError(`Failed to restart server ${id}`);
      } finally {
        setActionLoading(null);
      }
    },
    [presenter, updateServerInState]
  );

  return [
    { viewModel, loading, actionLoading, error },
    { startServer, stopServer, restartServer, refreshData },
  ];
}
