/**
 * IVpsRepository
 * Repository interface for VPS Server data access
 * Following Clean Architecture - Application Layer
 */

// ============================================
// DOMAIN MODELS
// ============================================

export interface VpsSpecs {
  cpu: number;           // cores
  ram: number;           // GB
  storage: number;       // GB
  bandwidth: number;     // TB/month
}

export interface VpsUsage {
  cpuPercent: number;
  ramPercent: number;
  storagePercent: number;
  bandwidthUsed: number; // GB
}

export interface VpsServer {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  location: string;        // e.g., "Singapore", "Tokyo"
  provider: string;        // e.g., "DigitalOcean", "Vultr", "Linode"
  status: 'running' | 'stopped' | 'restarting' | 'error';
  os: string;              // e.g., "Ubuntu 22.04", "Debian 12"
  specs: VpsSpecs;
  usage: VpsUsage;
  uptime: number;          // seconds
  createdAt: string;
  lastCheckedAt: string;
}

export interface DashboardStats {
  totalServers: number;
  runningServers: number;
  stoppedServers: number;
  errorServers: number;
  totalCpu: number;
  totalRam: number;
  totalStorage: number;
  avgCpuUsage: number;
  avgRamUsage: number;
}

// ============================================
// REPOSITORY INTERFACE
// ============================================

export interface IVpsRepository {
  /**
   * Get server by ID
   */
  getById(id: string): Promise<VpsServer | null>;

  /**
   * Get all servers
   */
  getAll(): Promise<VpsServer[]>;

  /**
   * Get dashboard statistics
   */
  getStats(): Promise<DashboardStats>;

  /**
   * Start a server
   */
  startServer(id: string): Promise<VpsServer>;

  /**
   * Stop a server
   */
  stopServer(id: string): Promise<VpsServer>;

  /**
   * Restart a server
   */
  restartServer(id: string): Promise<VpsServer>;
}
