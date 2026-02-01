/**
 * DashboardPresenter
 * Handles business logic for Dashboard
 * Receives repository via dependency injection
 */

import {
    DashboardStats,
    IVpsRepository,
    VpsServer,
} from '@/src/application/repositories/IVpsRepository';

export interface DashboardViewModel {
  servers: VpsServer[];
  stats: DashboardStats;
}

export class DashboardPresenter {
  constructor(private readonly repository: IVpsRepository) {}

  /**
   * Get view model for dashboard
   */
  async getViewModel(): Promise<DashboardViewModel> {
    const [servers, stats] = await Promise.all([
      this.repository.getAll(),
      this.repository.getStats(),
    ]);

    return { servers, stats };
  }

  /**
   * Start a server
   */
  async startServer(id: string): Promise<VpsServer> {
    return this.repository.startServer(id);
  }

  /**
   * Stop a server
   */
  async stopServer(id: string): Promise<VpsServer> {
    return this.repository.stopServer(id);
  }

  /**
   * Restart a server
   */
  async restartServer(id: string): Promise<VpsServer> {
    return this.repository.restartServer(id);
  }
}
