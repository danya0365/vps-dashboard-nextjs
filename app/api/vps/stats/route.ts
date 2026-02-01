import { MockVpsRepository } from '@/src/infrastructure/repositories/mock/MockVpsRepository';
import { SystemVpsRepository } from '@/src/infrastructure/repositories/system/SystemVpsRepository';
import { NextResponse } from 'next/server';

const repository = process.env.NODE_ENV === 'development' 
  ? new MockVpsRepository() 
  : new SystemVpsRepository();

export async function GET() {
  try {
    const stats = await repository.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
