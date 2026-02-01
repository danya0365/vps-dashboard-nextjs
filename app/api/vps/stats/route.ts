import { MockVpsRepository } from '@/src/infrastructure/repositories/mock/MockVpsRepository';
import { SshVpsRepository } from '@/src/infrastructure/repositories/system/SshVpsRepository';
import { NextResponse } from 'next/server';

const useSsh = process.env.NEXT_PUBLIC_USE_SSH !== 'false';

const repository = useSsh
  ? new SshVpsRepository()
  : new MockVpsRepository();

export async function GET() {
  try {
    const stats = await repository.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
