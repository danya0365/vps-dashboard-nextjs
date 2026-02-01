/**
 * MockVpsRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure Layer
 */

import {
  DashboardStats,
  DockerContainer,
  IVpsRepository,
  SystemService,
  VpsServer,
} from '@/src/application/repositories/IVpsRepository';

// ============================================
// MOCK DATA - World-class VPS servers
// ============================================

const DOCKER_SAMPLES: DockerContainer[] = [
  { name: 'nextjs-app', status: 'Up 2 weeks', image: 'ai-content-creator-nextjs:latest', uptime: '2 weeks ago' },
  { name: 'supabase-db', status: 'Up 2 weeks (healthy)', image: 'postgres:15-alpine', uptime: '2 weeks ago' },
  { name: 'traefik', status: 'Up 2 weeks', image: 'traefik:v3.0', uptime: '2 weeks ago' },
  { name: 'mysql-db', status: 'Up 2 weeks', image: 'mysql:8.0', uptime: '2 weeks ago' },
  { name: 'phpmyadmin', status: 'Up 2 weeks', image: 'phpmyadmin:latest', uptime: '2 weeks ago' },
];

const SERVICE_SAMPLES: SystemService[] = [
  { name: 'docker.service', status: 'running', description: 'Docker Application Container Engine' },
  { name: 'ssh.service', status: 'running', description: 'OpenBSD Secure Shell server' },
  { name: 'cron.service', status: 'running', description: 'Regular background program processing daemon' },
];

const MOCK_SERVERS: VpsServer[] = [
  {
    id: 'vps-203',
    name: 'Primary VPS',
    hostname: 'vmserver',
    ipAddress: '203.151.166.65',
    location: 'Bangkok, TH',
    provider: 'Managed',
    status: 'running',
    os: 'Ubuntu 22.04.5 LTS',
    specs: { cpu: 14, ram: 4, storage: 44, bandwidth: 10 },
    usage: { cpuPercent: 42, ramPercent: 68, storagePercent: 44, bandwidthUsed: 2.1 },
    uptime: 2167791,
    dockerContainers: [
      ...DOCKER_SAMPLES,
      { name: 'supabase-realtime', status: 'Restarting (1) 26 seconds ago', image: 'supabase/realtime:v2.30.6', uptime: '2 weeks ago' },
      { name: 'supabase-storage', status: 'Up 2 weeks (unhealthy)', image: 'supabase/storage-api:v1.21.1', uptime: '2 weeks ago' },
    ],
    services: SERVICE_SAMPLES,
    createdAt: '2024-01-15T10:30:00.000Z',
    lastCheckedAt: new Date().toISOString(),
  },
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
    uptime: 2592000,
    dockerContainers: DOCKER_SAMPLES,
    services: SERVICE_SAMPLES,
    createdAt: '2024-01-15T10:30:00.000Z',
    lastCheckedAt: new Date().toISOString(),
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
    uptime: 5184000,
    dockerContainers: DOCKER_SAMPLES.slice(0, 3),
    services: SERVICE_SAMPLES,
    createdAt: '2023-12-01T08:00:00.000Z',
    lastCheckedAt: new Date().toISOString(),
  }
];

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
    this.servers[index] = { ...this.servers[index], status: 'running' };
    return this.servers[index];
  }

  async stopServer(id: string): Promise<VpsServer> {
    await this.delay(500);
    const index = this.servers.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Server not found');
    this.servers[index] = { ...this.servers[index], status: 'stopped' };
    return this.servers[index];
  }

  async restartServer(id: string): Promise<VpsServer> {
    await this.delay(1000);
    const index = this.servers.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Server not found');
    this.servers[index] = { ...this.servers[index], status: 'running' };
    return this.servers[index];
  }
}
