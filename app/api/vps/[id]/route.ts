import { MockVpsRepository } from '@/src/infrastructure/repositories/mock/MockVpsRepository';
import { SshVpsRepository } from '@/src/infrastructure/repositories/system/SshVpsRepository';
import { NextRequest, NextResponse } from 'next/server';

const useSsh = process.env.NEXT_PUBLIC_USE_SSH !== 'false';

const repository = useSsh
  ? new SshVpsRepository()
  : new MockVpsRepository();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const server = await repository.getById(id);
    
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }
    
    return NextResponse.json(server);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const path = req.nextUrl.pathname;

    if (path.endsWith('/start')) {
      try {
        const result = await repository.startServer(id);
        return NextResponse.json(result);
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    if (path.endsWith('/stop')) {
      try {
        const result = await repository.stopServer(id);
        return NextResponse.json(result);
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    if (path.endsWith('/restart')) {
      try {
        const result = await repository.restartServer(id);
        return NextResponse.json(result);
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Action not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
