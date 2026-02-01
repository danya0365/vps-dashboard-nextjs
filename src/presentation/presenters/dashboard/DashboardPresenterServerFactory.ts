import { MockVpsRepository } from '@/src/infrastructure/repositories/mock/MockVpsRepository';
import { SshVpsRepository } from '@/src/infrastructure/repositories/system/SshVpsRepository';
import { DashboardPresenter } from './DashboardPresenter';

export class DashboardPresenterServerFactory {
  static create(): DashboardPresenter {
    // For local development, use Mock Repository to see full UI capabilities
    // In production, we use SshVpsRepository to monitor the host machine via SSH
    // (SystemVpsRepository inside Docker only sees container stats)
    const repository = process.env.NODE_ENV === 'development' 
      ? new MockVpsRepository() 
      : new SshVpsRepository();
      
    return new DashboardPresenter(repository);
  }
}

export function createServerDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterServerFactory.create();
}
