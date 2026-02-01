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
      const command = `
        echo "---OS---"
        lsb_release -d 2>/dev/null | cut -f2 || cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2
        echo "---CPU---"
        lscpu | grep "Model name" | sed 's/Model name:[[:space:]]*//'
        nproc
        echo "---MEM---"
        free -b
        echo "---DISK---"
        df -B1 / | tail -1 | awk '{print $2,$3}'
        echo "---UPTIME---"
        cat /proc/uptime | awk '{print $1}'
        echo "---DOCKER---"
        docker ps --format "{{.ID}}|{{.Names}}|{{.Status}}|{{.Image}}|{{.RunningFor}}" 2>/dev/null || echo "not-installed"
        echo "---DOCKER_STATS---"
        docker stats --no-stream --format "{{.ID}}|{{.CPUPerc}}|{{.MemUsage}}|{{.MemPerc}}" 2>/dev/null || echo ""
        echo "---LOAD---"
        cat /proc/loadavg
        echo "---IOWAIT---"
        top -bn1 | grep "Cpu(s)" | sed 's/.*, *\\([0-9.]*\\)%* wa.*/\\1/'
        echo "---TRAFFIC---"
        INTERFACE=$(ip -o -4 route show to default | head -1 | awk '{print $5}')
        if [ -n "$INTERFACE" ]; then
          grep "$INTERFACE" /proc/net/dev | awk '{print $2,$10}'
        else
          cat /proc/net/dev | grep -E "eth0|enp|eno" | head -1 | awk '{print $2,$10}'
        fi
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
    
    // Memory Parsing
    const memLines = sections['MEM'] || [];
    const memRow = memLines.find(l => l.startsWith('Mem:'))?.split(/\s+/) || [];
    const swapRow = memLines.find(l => l.startsWith('Swap:'))?.split(/\s+/) || [];
    
    const totalMem = parseInt(memRow[1] || '0');
    const usedMem = parseInt(memRow[2] || '0');
    const swapTotal = parseInt(swapRow[1] || '0');
    const swapUsed = parseInt(swapRow[2] || '0');

    const diskData = sections['DISK']?.[0]?.split(' ') || ['0', '0'];
    const totalDisk = parseInt(diskData[0]);
    const usedDisk = parseInt(diskData[1]);

    const uptime = parseFloat(sections['UPTIME']?.[0] || '0');
    const loadData = sections['LOAD']?.[0]?.split(' ') || ['0', '0', '0'];
    const load1 = parseFloat(loadData[0]) || 0;
    const load5 = parseFloat(loadData[1]) || 0;
    const load15 = parseFloat(loadData[2]) || 0;
    const ioWait = parseFloat(sections['IOWAIT']?.[0] || '0') || 0;

    // Docker Stats Parsing
    // Format: ID|CPUPerc|MemUsage|MemPerc
    // MemUsage example: "207MiB / 7.653GiB" - contains both used and limit separated by " / "
    console.log('[Docker Stats] Raw lines:', sections['DOCKER_STATS']);
    console.log('[Docker] Raw lines:', sections['DOCKER']);
    const dockerStatsMap = new Map<string, { cpu: number, mem: number, limit: number, memPerc: number }>();
    (sections['DOCKER_STATS'] || []).forEach(line => {
        const parts = line.split('|');
        if (parts.length < 4) return;
        
        const id = parts[0]?.trim();
        const cpuStr = parts[1]?.trim();
        const memUsageStr = parts[2]?.trim(); // "207MiB / 7.653GiB"
        const memPercStr = parts[3]?.trim();
        
        if (!id || !cpuStr) return;

        // Helper to safely extract numeric values (handles %, units, etc)
        const extractNumber = (str: string): number => {
            if (!str) return 0;
            // Match the first valid float number in the string
            const match = str.match(/([0-9.]+)/);
            return match ? parseFloat(match[1]) : 0;
        };

        // Parse memory value with unit to MB
        const parseMemoryToMB = (str: string): number => {
            if (!str) return 0;
            const match = str.match(/([0-9.]+)\s*([a-zA-Z]+)/);
            if (!match) return 0;
            let value = parseFloat(match[1]);
            if (isNaN(value)) return 0;
            const unit = match[2].toUpperCase();
            
            if (unit.startsWith('G')) value *= 1024;          // GiB -> MB
            else if (unit.startsWith('K')) value /= 1024;     // KiB -> MB 
            else if (unit.startsWith('B') && !unit.startsWith('BI')) value /= (1024 * 1024); // B -> MB
            // MiB stays as-is (already MB)
            return value;
        };

        // Parse MemUsage: "207MiB / 7.653GiB"
        const memParts = memUsageStr.split('/').map(s => s.trim());
        const memUsed = parseMemoryToMB(memParts[0] || '');
        const memLimit = parseMemoryToMB(memParts[1] || '');

        // Use robust extraction for percentages
        const cpuValue = extractNumber(cpuStr);
        const memPercValue = extractNumber(memPercStr);
        
        dockerStatsMap.set(id, {
            cpu: isNaN(cpuValue) ? 0 : cpuValue,
            mem: memUsed,
            limit: memLimit,
            memPerc: isNaN(memPercValue) ? 0 : memPercValue
        });
    });

    // Parse Docker
    const dockerContainers: DockerContainer[] = (sections['DOCKER'] || [])
      .filter(line => line !== 'not-installed')
      .map(line => {
        const [id, name, status, image, uptimeStr] = line.split('|');
        const trimmedId = id?.trim();
        const stats = dockerStatsMap.get(trimmedId);
        
        // Debug logging
        console.log(`[Docker] Container: ${name?.trim()}, ID: ${trimmedId}, HasStats: ${!!stats}, CPU: ${stats?.cpu}, Mem: ${stats?.mem}`);
        
        return { 
            name: name?.trim() || 'Unknown', 
            status, 
            image, 
            uptime: uptimeStr,
            cpuPercent: stats?.cpu || 0,
            memoryUsage: stats?.mem || 0,
            memoryLimit: stats?.limit || 0
        };
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

    const traffic = sections['TRAFFIC']?.[0]?.split(' ') || ['0', '0'];

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
        cpuPercent: Math.min(Math.round(load1 * 100 / cpuCores), 100),
        ramPercent: Math.round((usedMem / totalMem) * 100),
        storagePercent: Math.round((usedDisk / totalDisk) * 100),
        bandwidthUsed: 0,
        loadAverage: load1,
        loadAverages: [load1, load5, load15],
        ioWait,
        ramUsage: {
            used: Math.round(usedMem / (1024 * 1024)),
            total: Math.round(totalMem / (1024 * 1024)),
            swapUsed: Math.round(swapUsed / (1024 * 1024)),
            swapTotal: Math.round(swapTotal / (1024 * 1024))
        },
        networkThroughput: {
            in: parseInt(traffic[0]),
            out: parseInt(traffic[1])
        },
        diskIo: {
            read: 0,
            write: 0
        }
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
      avgLoadAverage: server.usage.loadAverage,
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
      avgLoadAverage: 0,
    };
  }

  async startServer(id: string): Promise<VpsServer> { throw new Error('Not implemented'); }
  async stopServer(id: string): Promise<VpsServer> { throw new Error('Not implemented'); }
  async restartServer(id: string): Promise<VpsServer> { throw new Error('Not implemented'); }
}
