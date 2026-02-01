/**
 * DashboardPresenterClientFactory
 * Factory for creating DashboardPresenter instances on the client side
 */

import { ApiVpsRepository } from '@/src/infrastructure/repositories/api/ApiVpsRepository';
import { MockVpsRepository } from '@/src/infrastructure/repositories/mock/MockVpsRepository';
import { DashboardPresenter } from './DashboardPresenter';

export class DashboardPresenterClientFactory {
  static create(): DashboardPresenter {
    // For local development, use Mock Repository to avoid network dependencies
    // But allow overriding with NEXT_PUBLIC_USE_SSH to test real API/SSH flow
    // Default to TRUE as requested, so use !== 'false'
    const useRealApi = process.env.NEXT_PUBLIC_USE_SSH !== 'false';

    // In production, use ApiVpsRepository to fetch from our mirrored API routes
    const repository = (useRealApi || process.env.NODE_ENV === 'production')
      ? new ApiVpsRepository()
      : new MockVpsRepository();
      
    return new DashboardPresenter(repository);
  }
}

export function createClientDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterClientFactory.create();
}
