import { MockVpsRepository } from '@/src/infrastructure/repositories/mock/MockVpsRepository';
import { SystemVpsRepository } from '@/src/infrastructure/repositories/system/SystemVpsRepository';
import { NextRequest, NextResponse } from 'next/server';

const repository = process.env.NODE_ENV === 'development' 
  ? new MockVpsRepository() 
  : new SystemVpsRepository();

/**
 * GET /api/vps
 * Returns list of all servers
 */
export async function GET(req: NextRequest) {
  try {
    const servers = await repository.getAll();
    return NextResponse.json(servers);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
