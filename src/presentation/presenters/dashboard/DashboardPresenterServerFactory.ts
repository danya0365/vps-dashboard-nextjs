import { MockVpsRepository } from '@/src/infrastructure/repositories/mock/MockVpsRepository';
import { SystemVpsRepository } from '@/src/infrastructure/repositories/system/SystemVpsRepository';
import { DashboardPresenter } from './DashboardPresenter';

export class DashboardPresenterServerFactory {
  static create(): DashboardPresenter {
    // For local development, use Mock Repository to see full UI capabilities
    // In production/deployment, use SystemVpsRepository
    const repository = process.env.NODE_ENV === 'development' 
      ? new MockVpsRepository() 
      : new SystemVpsRepository();
      
    return new DashboardPresenter(repository);
  }
}

export function createServerDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterServerFactory.create();
}
