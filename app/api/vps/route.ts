import { SystemVpsRepository } from '@/src/infrastructure/repositories/system/SystemVpsRepository';
import { NextRequest, NextResponse } from 'next/server';

const repository = new SystemVpsRepository();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = req.nextUrl.pathname;

    if (path.endsWith('/stats')) {
      const stats = await repository.getStats();
      return NextResponse.json(stats);
    }

    const servers = await repository.getAll();
    return NextResponse.json(servers);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Handler for individual server requests if needed
// Note: In Next.js App Router, you'd usually use [id] folders, 
// but for simplicity in this MVP we handle basic GET here.
// We can add more specific routes later if needed.
