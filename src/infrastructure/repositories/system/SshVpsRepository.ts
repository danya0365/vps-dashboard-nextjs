import {
  DashboardStats,
  DockerContainer,
  IVpsRepository,
  SystemService,
  VpsServer,
} from '@/src/application/repositories/IVpsRepository';
import { Client } from 'ssh2';

/**
 * SshVpsRepository
 * Implementation of IVpsRepository using SSH connections for remote monitoring
 * Following Clean Architecture - Infrastructure Layer
 */
export class SshVpsRepository implements IVpsRepository {
  private config = {
    host: process.env.VPS_SSH_HOST || '203.151.166.65',
    port: parseInt(process.env.VPS_SSH_PORT || '2222'),
    username: process.env.VPS_SSH_USER || 'acuser01',
    password: process.env.VPS_SSH_PASS || '*******',
  };

  private async executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const conn = new Client();
      conn
        .on('ready', () => {
          conn.exec(command, (err, stream) => {
            if (err) {
              conn.end();
              return reject(err);
            }
            let data = '';
            stream
              .on('close', (code: number, signal: string) => {
                conn.end();
                resolve(data);
              })
              .on('data', (chunk: Buffer) => {
                data += chunk.toString();
              })
              .stderr.on('data', (chunk: Buffer) => {
                console.error('SSH STDERR:', chunk.toString());
              });
          });
        })
        .on('error', (err) => {
          reject(err);
        })
        .connect(this.config);
    });
  }

  async getById(id: string): Promise<VpsServer | null> {
    const servers = await this.getAll();
    return servers.find((s) => s.id === id) || null;
  }

  async getAll(): Promise<VpsServer[]> {
    try {
      // Combined command to reduce SSH connections
      const command = `
        echo "---OS---"
        lsb_release -d | cut -f2
        echo "---CPU---"
        lscpu | grep "Model name" | sed 's/Model name:[[:space:]]*//'
        nproc
        echo "---MEM---"
        free -b | grep Mem | awk '{print $2,$3}'
        echo "---DISK---"
        df -B1 / | tail -1 | awk '{print $2,$3}'
        echo "---UPTIME---"
        cat /proc/uptime | awk '{print $1}'
        echo "---DOCKER---"
        docker ps --format "{{.Names}}|{{.Status}}|{{.Image}}|{{.RunningFor}}" 2>/dev/null || echo "not-installed"
        echo "---SERVICES---"
        systemctl list-units --type=service --state=running --no-pager --no-legend | awk '{print $1"|"$4}' | head -n 20
        echo "---LOAD---"
        cat /proc/loadavg | awk '{print $1}'
      `;

      const output = await this.executeCommand(command);
      return [this.parseOutput(output)];
    } catch (error) {
      console.error('Error fetching SSH data:', error);
      return [];
    }
  }

  private parseOutput(output: string): VpsServer {
    const sections: Record<string, string[]> = {};
    let currentSection = '';

    output.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('---') && trimmed.endsWith('---')) {
        currentSection = trimmed.replace(/---/g, '');
        sections[currentSection] = [];
      } else if (currentSection && trimmed) {
        sections[currentSection].push(trimmed);
      }
    });

    const os = sections['OS']?.[0] || 'Unknown';
    const cpuModel = sections['CPU']?.[0] || 'Unknown';
    const cpuCores = parseInt(sections['CPU']?.[1] || '1');
    
    const memData = sections['MEM']?.[0]?.split(' ') || ['0', '0'];
    const totalMem = parseInt(memData[0]);
    const usedMem = parseInt(memData[1]);

    const diskData = sections['DISK']?.[0]?.split(' ') || ['0', '0'];
    const totalDisk = parseInt(diskData[0]);
    const usedDisk = parseInt(diskData[1]);

    const uptime = parseFloat(sections['UPTIME']?.[0] || '0');
    const load = parseFloat(sections['LOAD']?.[0] || '0');

    // Parse Docker
    const dockerContainers: DockerContainer[] = (sections['DOCKER'] || [])
      .filter(line => line !== 'not-installed')
      .map(line => {
        const [name, status, image, uptimeStr] = line.split('|');
        return { name, status, image, uptime: uptimeStr };
      });

    // Parse Services
    const services: SystemService[] = (sections['SERVICES'] || []).map(line => {
      const [name, status] = line.split('|');
      return { 
        name, 
        status: status === 'running' ? 'running' : 'stopped',
        description: name
      };
    });

    return {
      id: 'vps-remote',
      name: 'Primary VPS (Remote)',
      hostname: 'vmserver',
      ipAddress: this.config.host,
      location: 'Bangkok, TH',
      provider: 'Managed',
      status: 'running',
      os,
      specs: {
        cpu: cpuCores,
        ram: Math.round(totalMem / (1024 * 1024 * 1024)),
        storage: Math.round(totalDisk / (1024 * 1024 * 1024)),
        bandwidth: 10,
      },
      usage: {
        cpuPercent: Math.min(Math.round(load * 100 / cpuCores), 100),
        ramPercent: Math.round((usedMem / totalMem) * 100),
        storagePercent: Math.round((usedDisk / totalDisk) * 100),
        bandwidthUsed: 0,
      },
      uptime,
      dockerContainers,
      services,
      createdAt: new Date(Date.now() - uptime * 1000).toISOString(),
      lastCheckedAt: new Date().toISOString(),
    };
  }

  async getStats(): Promise<DashboardStats> {
    const servers = await this.getAll();
    const server = servers[0];
    if (!server) return this.getEmptyStats();

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

  private getEmptyStats(): DashboardStats {
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

  async startServer(id: string): Promise<VpsServer> { throw new Error('Not implemented'); }
  async stopServer(id: string): Promise<VpsServer> { throw new Error('Not implemented'); }
  async restartServer(id: string): Promise<VpsServer> { throw new Error('Not implemented'); }
}
