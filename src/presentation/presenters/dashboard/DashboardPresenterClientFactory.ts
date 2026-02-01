/**
 * DashboardPresenterClientFactory
 * Factory for creating DashboardPresenter instances on the client side
 */

import { ApiVpsRepository } from '@/src/infrastructure/repositories/api/ApiVpsRepository';
import { DashboardPresenter } from './DashboardPresenter';

export class DashboardPresenterClientFactory {
  static create(): DashboardPresenter {
    const repository = new ApiVpsRepository();
    return new DashboardPresenter(repository);
  }
}

export function createClientDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterClientFactory.create();
}
