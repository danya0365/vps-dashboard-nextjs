import { SystemVpsRepository } from '@/src/infrastructure/repositories/system/SystemVpsRepository';
import { DashboardPresenter } from './DashboardPresenter';

export class DashboardPresenterServerFactory {
  static create(): DashboardPresenter {
    // Use System Repository for production monitoring
    const repository = new SystemVpsRepository();
    return new DashboardPresenter(repository);
  }
}

export function createServerDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterServerFactory.create();
}
