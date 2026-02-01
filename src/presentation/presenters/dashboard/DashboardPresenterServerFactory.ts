/**
 * DashboardPresenterServerFactory
 * Factory for creating DashboardPresenter instances on the server side
 */

import { MockVpsRepository } from '@/src/infrastructure/repositories/mock/MockVpsRepository';
import { DashboardPresenter } from './DashboardPresenter';

export class DashboardPresenterServerFactory {
  static create(): DashboardPresenter {
    // Use Mock Repository for development
    const repository = new MockVpsRepository();
    return new DashboardPresenter(repository);
  }
}

export function createServerDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterServerFactory.create();
}
