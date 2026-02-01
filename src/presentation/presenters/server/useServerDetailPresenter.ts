"use client";

import { VpsServer } from "@/src/application/repositories/IVpsRepository";
import { createClientDashboardPresenter } from "@/src/presentation/presenters/dashboard/DashboardPresenterClientFactory";
import { useCallback, useMemo, useState } from "react";
import { useToast } from "../../components/common/Toast";

export interface ServerDetailState {
  server: VpsServer;
  loading: boolean;
  error: string | null;
}

export interface ServerDetailActions {
  startServer: () => Promise<void>;
  stopServer: () => Promise<void>;
  restartServer: () => Promise<void>;
  refreshData: () => Promise<void>;
}

/**
 * useServerDetailPresenter - Hook for individual server details
 */
export function useServerDetailPresenter(
  initialServer: VpsServer
): [ServerDetailState, ServerDetailActions] {
  const [server, setServer] = useState<VpsServer>(initialServer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const presenter = useMemo(() => createClientDashboardPresenter(), []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedServers = await presenter.getServers();
      const updated = updatedServers.find(s => s.id === server.id);
      if (updated) {
        setServer(updated);
      }
    } catch (err: any) {
      setError("Failed to refresh server data");
    } finally {
      setLoading(false);
    }
  }, [presenter, server.id]);

  const handleAction = useCallback(async (action: 'start' | 'stop' | 'restart', actionFn: (id: string) => Promise<VpsServer>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await actionFn(server.id);
      setServer(updated);
      addToast({
        type: "success",
        title: `Server ${action === 'start' ? 'Started' : action === 'stop' ? 'Stopped' : 'Restarted'}`,
        message: `${server.name} has been ${action}ed successfully.`,
      });
    } catch (err: any) {
      const message = err.message || `Failed to ${action} server`;
      setError(message);
      addToast({
        type: "error",
        title: "Action Failed",
        message: message,
      });
    } finally {
      setLoading(false);
    }
  }, [server.id, server.name, addToast]);

  const startServer = useCallback(() => handleAction('start', (id) => presenter.startServer(id)), [handleAction, presenter]);
  const stopServer = useCallback(() => handleAction('stop', (id) => presenter.stopServer(id)), [handleAction, presenter]);
  const restartServer = useCallback(() => handleAction('restart', (id) => presenter.restartServer(id)), [handleAction, presenter]);

  return [
    { server, loading, error },
    { startServer, stopServer, restartServer, refreshData },
  ];
}
