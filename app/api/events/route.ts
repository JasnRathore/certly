import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, createEvent } from '@/lib/storage';
import { getActiveOrg } from '@/lib/auth-utils';

export async function GET() {
  try {
    const { organization } = await getActiveOrg();
    const events = await getAllEvents(organization.id);
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { organization } = await getActiveOrg();
    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    
    const event = await createEvent(name, description || '', organization.id);
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
