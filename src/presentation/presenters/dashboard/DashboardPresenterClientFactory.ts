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
    // In production, use ApiVpsRepository to fetch from our mirrored API routes
    const repository = process.env.NODE_ENV === 'development'
      ? new MockVpsRepository()
      : new ApiVpsRepository();
      
    return new DashboardPresenter(repository);
  }
}

export function createClientDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterClientFactory.create();
}
