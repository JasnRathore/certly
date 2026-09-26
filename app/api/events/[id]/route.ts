import { NextRequest, NextResponse } from 'next/server';
import { getEvent, updateEvent, deleteEvent } from '@/lib/storage';
import { getActiveOrg } from '@/lib/auth-utils';

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, ctx: Context) {
  try {
    const { organization } = await getActiveOrg();
    const { id } = await ctx.params;
    const event = await getEvent(id, organization.id);
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest, ctx: Context) {
  try {
    const { organization } = await getActiveOrg();
    const { id } = await ctx.params;
    const body = await req.json();
    const updated = await updateEvent(id, organization.id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest, ctx: Context) {
  try {
    const { organization } = await getActiveOrg();
    const { id } = await ctx.params;
    await deleteEvent(id, organization.id);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
