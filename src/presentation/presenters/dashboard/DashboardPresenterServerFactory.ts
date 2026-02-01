import { MockVpsRepository } from '@/src/infrastructure/repositories/mock/MockVpsRepository';
import { SshVpsRepository } from '@/src/infrastructure/repositories/system/SshVpsRepository';
import { DashboardPresenter } from './DashboardPresenter';

export class DashboardPresenterServerFactory {
  static create(): DashboardPresenter {
    // For local development, use Mock Repository to see full UI capabilities
    // But allow overriding with NEXT_PUBLIC_USE_SSH to test real connections
    // Default to TRUE as requested, so use !== 'false'
    const useSsh = process.env.NEXT_PUBLIC_USE_SSH !== 'false';
    
    // In production, we use SshVpsRepository to monitor the host machine via SSH
    // (SystemVpsRepository inside Docker only sees container stats)
    const repository = useSsh
      ? new SshVpsRepository()
      : new MockVpsRepository();
      
    return new DashboardPresenter(repository);
  }
}

export function createServerDashboardPresenter(): DashboardPresenter {
  return DashboardPresenterServerFactory.create();
}
