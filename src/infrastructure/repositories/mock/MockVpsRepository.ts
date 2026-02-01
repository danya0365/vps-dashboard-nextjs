/**
 * MockVpsRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure Layer
 */

import {
    DashboardStats,
    IVpsRepository,
    VpsServer,
} from '@/src/application/repositories/IVpsRepository';

// ============================================
// MOCK DATA - World-class VPS servers
// ============================================

const MOCK_SERVERS: VpsServer[] = [
  {
    id: 'vps-001',
    name: 'Production API',
    hostname: 'api.myapp.com',
    ipAddress: '167.71.192.45',
    location: 'Singapore',
    provider: 'DigitalOcean',
    status: 'running',
    os: 'Ubuntu 22.04 LTS',
    specs: { cpu: 4, ram: 8, storage: 160, bandwidth: 5 },
    usage: { cpuPercent: 45, ramPercent: 62, storagePercent: 38, bandwidthUsed: 1.8 },
    uptime: 2592000, // 30 days
    createdAt: '2024-01-15T10:30:00.000Z',
    lastCheckedAt: '2026-02-01T09:45:00.000Z',
  },
  {
    id: 'vps-002',
    name: 'Database Master',
    hostname: 'db-master.myapp.com',
    ipAddress: '165.22.108.123',
    location: 'Singapore',
    provider: 'DigitalOcean',
    status: 'running',
    os: 'Ubuntu 22.04 LTS',
    specs: { cpu: 8, ram: 32, storage: 500, bandwidth: 8 },
    usage: { cpuPercent: 28, ramPercent: 75, storagePercent: 52, bandwidthUsed: 3.2 },
    uptime: 5184000, // 60 days
    createdAt: '2023-12-01T08:00:00.000Z',
    lastCheckedAt: '2026-02-01T09:45:00.000Z',
  },
  {
    id: 'vps-003',
    name: 'Frontend CDN',
    hostname: 'cdn.myapp.com',
    ipAddress: '139.59.234.89',
    location: 'Tokyo',
    provider: 'Vultr',
    status: 'running',
    os: 'Debian 12',
    specs: { cpu: 2, ram: 4, storage: 80, bandwidth: 10 },
    usage: { cpuPercent: 15, ramPercent: 42, storagePercent: 25, bandwidthUsed: 6.5 },
    uptime: 1296000, // 15 days
    createdAt: '2024-01-17T14:00:00.000Z',
    lastCheckedAt: '2026-02-01T09:45:00.000Z',
  },
  {
    id: 'vps-004',
    name: 'Worker Node 1',
    hostname: 'worker-1.myapp.com',
    ipAddress: '45.77.156.201',
    location: 'Frankfurt',
    provider: 'Vultr',
    status: 'running',
    os: 'Ubuntu 24.04 LTS',
    specs: { cpu: 4, ram: 16, storage: 200, bandwidth: 5 },
    usage: { cpuPercent: 88, ramPercent: 56, storagePercent: 18, bandwidthUsed: 0.8 },
    uptime: 864000, // 10 days
    createdAt: '2024-01-22T11:30:00.000Z',
    lastCheckedAt: '2026-02-01T09:45:00.000Z',
  },
  {
    id: 'vps-005',
    name: 'Staging Server',
    hostname: 'staging.myapp.com',
    ipAddress: '172.105.45.67',
    location: 'Mumbai',
    provider: 'Linode',
    status: 'stopped',
    os: 'Ubuntu 22.04 LTS',
    specs: { cpu: 2, ram: 4, storage: 80, bandwidth: 3 },
    usage: { cpuPercent: 0, ramPercent: 0, storagePercent: 45, bandwidthUsed: 0.2 },
    uptime: 0,
    createdAt: '2024-01-10T09:00:00.000Z',
    lastCheckedAt: '2026-02-01T09:45:00.000Z',
  },
  {
    id: 'vps-006',
    name: 'Backup Storage',
    hostname: 'backup.myapp.com',
    ipAddress: '194.195.247.112',
    location: 'Amsterdam',
    provider: 'Hetzner',
    status: 'running',
    os: 'Debian 12',
    specs: { cpu: 2, ram: 8, storage: 1000, bandwidth: 10 },
    usage: { cpuPercent: 8, ramPercent: 22, storagePercent: 78, bandwidthUsed: 2.1 },
    uptime: 7776000, // 90 days
    createdAt: '2023-11-01T06:00:00.000Z',
    lastCheckedAt: '2026-02-01T09:45:00.000Z',
  },
  {
    id: 'vps-007',
    name: 'Redis Cache',
    hostname: 'redis.myapp.com',
    ipAddress: '104.248.128.55',
    location: 'Singapore',
    provider: 'DigitalOcean',
    status: 'error',
    os: 'Ubuntu 22.04 LTS',
    specs: { cpu: 2, ram: 16, storage: 50, bandwidth: 2 },
    usage: { cpuPercent: 0, ramPercent: 0, storagePercent: 12, bandwidthUsed: 0.1 },
    uptime: 0,
    createdAt: '2024-01-05T12:00:00.000Z',
    lastCheckedAt: '2026-02-01T09:45:00.000Z',
  },
  {
    id: 'vps-008',
    name: 'Monitoring Stack',
    hostname: 'monitor.myapp.com',
    ipAddress: '185.199.110.88',
    location: 'London',
    provider: 'AWS Lightsail',
    status: 'running',
    os: 'Amazon Linux 2023',
    specs: { cpu: 4, ram: 8, storage: 120, bandwidth: 4 },
    usage: { cpuPercent: 32, ramPercent: 68, storagePercent: 55, bandwidthUsed: 1.4 },
    uptime: 3456000, // 40 days
    createdAt: '2023-12-22T15:30:00.000Z',
    lastCheckedAt: '2026-02-01T09:45:00.000Z',
  },
];

// ============================================
// MOCK REPOSITORY IMPLEMENTATION
// ============================================

export class MockVpsRepository implements IVpsRepository {
  private servers: VpsServer[] = [...MOCK_SERVERS];

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getById(id: string): Promise<VpsServer | null> {
    await this.delay(100);
    return this.servers.find((s) => s.id === id) || null;
  }

  async getAll(): Promise<VpsServer[]> {
    await this.delay(150);
    return [...this.servers];
  }

  async getStats(): Promise<DashboardStats> {
    await this.delay(100);

    const runningServers = this.servers.filter((s) => s.status === 'running');
    const stoppedServers = this.servers.filter((s) => s.status === 'stopped');
    const errorServers = this.servers.filter((s) => s.status === 'error');

    const totalCpu = this.servers.reduce((acc, s) => acc + s.specs.cpu, 0);
    const totalRam = this.servers.reduce((acc, s) => acc + s.specs.ram, 0);
    const totalStorage = this.servers.reduce((acc, s) => acc + s.specs.storage, 0);

    const avgCpuUsage =
      runningServers.length > 0
        ? runningServers.reduce((acc, s) => acc + s.usage.cpuPercent, 0) / runningServers.length
        : 0;

    const avgRamUsage =
      runningServers.length > 0
        ? runningServers.reduce((acc, s) => acc + s.usage.ramPercent, 0) / runningServers.length
        : 0;

    return {
      totalServers: this.servers.length,
      runningServers: runningServers.length,
      stoppedServers: stoppedServers.length,
      errorServers: errorServers.length,
      totalCpu,
      totalRam,
      totalStorage,
      avgCpuUsage: Math.round(avgCpuUsage),
      avgRamUsage: Math.round(avgRamUsage),
    };
  }

  async startServer(id: string): Promise<VpsServer> {
    await this.delay(500);
    const index = this.servers.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Server not found');

    this.servers[index] = {
      ...this.servers[index],
      status: 'running',
      uptime: 0,
      lastCheckedAt: new Date().toISOString(),
    };
    return this.servers[index];
  }

  async stopServer(id: string): Promise<VpsServer> {
    await this.delay(500);
    const index = this.servers.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Server not found');

    this.servers[index] = {
      ...this.servers[index],
      status: 'stopped',
      uptime: 0,
      usage: { cpuPercent: 0, ramPercent: 0, storagePercent: this.servers[index].usage.storagePercent, bandwidthUsed: 0 },
      lastCheckedAt: new Date().toISOString(),
    };
    return this.servers[index];
  }

  async restartServer(id: string): Promise<VpsServer> {
    await this.delay(1000);
    const index = this.servers.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Server not found');

    this.servers[index] = {
      ...this.servers[index],
      status: 'running',
      uptime: 0,
      lastCheckedAt: new Date().toISOString(),
    };
    return this.servers[index];
  }
}

// Export singleton instance
export const mockVpsRepository = new MockVpsRepository();
