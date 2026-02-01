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
  VpsServer
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
      const [cpu, mem, fs, net, osInfo, time, docker, services, loadData] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.networkStats(),
        si.osInfo(),
        si.time(),
        si.dockerContainers(true), // true for stats
        si.services('ssh, docker, containerd, cron, mysql, nextjs-app, supabase-db, postgrest, traefik'),
        si.currentLoad(), // Using it again for ioWait
      ]);

      const hostname = os.hostname();
      const ipAddress = this.getPrimaryIp();
      const totalDisk = fs.reduce((acc, drive) => acc + drive.size, 0);
      const usedDisk = fs.reduce((acc, drive) => acc + drive.used, 0);
      
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
          loadAverage: os.loadavg()[0],
          loadAverages: [os.loadavg()[0], os.loadavg()[1], os.loadavg()[2]],
          ioWait: cpu.cpus[0]?.loadIrq || 0, // Simplified ioWait
          ramUsage: {
            used: Math.round(mem.active / (1024 * 1024)),
            total: Math.round(mem.total / (1024 * 1024)),
            swapUsed: Math.round(mem.swapused / (1024 * 1024)),
            swapTotal: Math.round(mem.swaptotal / (1024 * 1024))
          },
          networkThroughput: {
            in: Math.round(net.reduce((acc, n) => acc + n.rx_sec, 0) / 1024),
            out: Math.round(net.reduce((acc, n) => acc + n.tx_sec, 0) / 1024)
          },
          diskIo: {
            read: 0,
            write: 0
          }
        },
        uptime: time.uptime,
        dockerContainers: docker.map((c: any) => ({
          name: c.name,
          status: c.state,
          image: c.image,
          uptime: new Date(c.started * 1000).toLocaleString(),
          cpuPercent: c.cpuPercent || 0,
          memoryUsage: Math.round((c.memUsage || 0) / (1024 * 1024)),
          memoryLimit: Math.round((c.memLimit || 0) / (1024 * 1024))
        })),
        services: services.map(s => ({
          name: s.name,
          status: s.running ? 'running' : 'stopped',
          description: s.name,
        })),
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
        avgLoadAverage: 0,
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
      avgLoadAverage: server.usage.loadAverage,
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
