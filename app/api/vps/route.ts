import { MockVpsRepository } from '@/src/infrastructure/repositories/mock/MockVpsRepository';
import { SshVpsRepository } from '@/src/infrastructure/repositories/system/SshVpsRepository';
import { NextRequest, NextResponse } from 'next/server';

const useSsh = process.env.NEXT_PUBLIC_USE_SSH !== 'false';

const repository = useSsh
  ? new SshVpsRepository()
  : new MockVpsRepository();

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
