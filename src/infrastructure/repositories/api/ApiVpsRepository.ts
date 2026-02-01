/**
 * ApiVpsRepository
 * Implements IVpsRepository using API calls instead of direct system access
 * 
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import {
    DashboardStats,
    IVpsRepository,
    VpsServer,
} from '@/src/application/repositories/IVpsRepository';

export class ApiVpsRepository implements IVpsRepository {
  private baseUrl = '/api/vps';

  async getById(id: string): Promise<VpsServer | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch server');
    return res.json();
  }

  async getAll(): Promise<VpsServer[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error('Failed to fetch servers');
    return res.json();
  }

  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${this.baseUrl}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }

  async startServer(id: string): Promise<VpsServer> {
    const res = await fetch(`${this.baseUrl}/${id}/start`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to start server');
    return res.json();
  }

  async stopServer(id: string): Promise<VpsServer> {
    const res = await fetch(`${this.baseUrl}/${id}/stop`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to stop server');
    return res.json();
  }

  async restartServer(id: string): Promise<VpsServer> {
    const res = await fetch(`${this.baseUrl}/${id}/restart`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to restart server');
    return res.json();
  }
}
