/**
 * SystemVpsRepository
 * Implementation of IVpsRepository using systeminformation
 * Following Clean Architecture - Infrastructure Layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import {
    DashboardStats,
    IVpsRepository,
    VpsServer,
} from '@/src/application/repositories/IVpsRepository';
import os from 'os';
import si from 'systeminformation';

export class SystemVpsRepository implements IVpsRepository {
  /**
   * Get host machine as a "VPS" entry
   */
  async getById(id: string): Promise<VpsServer | null> {
    const servers = await this.getAll();
    return servers.find((s) => s.id === id) || null;
  }

  /**
   * Get system information and map it to VpsServer model
   */
  async getAll(): Promise<VpsServer[]> {
    try {
      const [cpu, mem, fs, net, osInfo, time] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.networkStats(),
        si.osInfo(),
        si.time(),
      ]);

      const hostname = os.hostname();
      const ipAddress = this.getPrimaryIp();
      const totalDisk = fs.reduce((acc, drive) => acc + drive.size, 0);
      const usedDisk = fs.reduce((acc, drive) => acc + drive.used, 0);
      
      // Calculate bandwidth (simplified for this dashboard)
      const bandwidthUsed = net.reduce((acc, iface) => acc + iface.tx_bytes + iface.rx_bytes, 0) / (1024 * 1024 * 1024); // GB

      const hostServer: VpsServer = {
        id: 'host-machine',
        name: 'Host machine',
        hostname: hostname,
        ipAddress: ipAddress,
        location: 'Local',
        provider: 'Bare Metal',
        status: 'running',
        os: `${osInfo.distro} ${osInfo.release}`,
        specs: {
          cpu: os.cpus().length,
          ram: Math.round(mem.total / (1024 * 1024 * 1024)), // GB
          storage: Math.round(totalDisk / (1024 * 1024 * 1024)), // GB
          bandwidth: 10, // Placeholder
        },
        usage: {
          cpuPercent: Math.round(cpu.currentLoad),
          ramPercent: Math.round((mem.active / mem.total) * 100),
          storagePercent: Math.round((usedDisk / totalDisk) * 100),
          bandwidthUsed: parseFloat(bandwidthUsed.toFixed(2)),
        },
        uptime: time.uptime,
        createdAt: new Date(Date.now() - time.uptime * 1000).toISOString(),
        lastCheckedAt: new Date().toISOString(),
      };

      return [hostServer];
    } catch (error) {
      console.error('Error fetching system information:', error);
      return [];
    }
  }

  async getStats(): Promise<DashboardStats> {
    const servers = await this.getAll();
    const server = servers[0];

    if (!server) {
      return {
        totalServers: 0,
        runningServers: 0,
        stoppedServers: 0,
        errorServers: 0,
        totalCpu: 0,
        totalRam: 0,
        totalStorage: 0,
        avgCpuUsage: 0,
        avgRamUsage: 0,
      };
    }

    return {
      totalServers: 1,
      runningServers: 1,
      stoppedServers: 0,
      errorServers: 0,
      totalCpu: server.specs.cpu,
      totalRam: server.specs.ram,
      totalStorage: server.specs.storage,
      avgCpuUsage: server.usage.cpuPercent,
      avgRamUsage: server.usage.ramPercent,
    };
  }

  async startServer(id: string): Promise<VpsServer> {
    throw new Error('Action not supported for host machine via dashboard');
  }

  async stopServer(id: string): Promise<VpsServer> {
    throw new Error('Action not supported for host machine via dashboard');
  }

  async restartServer(id: string): Promise<VpsServer> {
    throw new Error('Action not supported for host machine via dashboard');
  }

  private getPrimaryIp(): string {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]!) {
        if (!iface.internal && iface.family === 'IPv4') {
          return iface.address;
        }
      }
    }
    return '127.0.0.1';
  }
}
