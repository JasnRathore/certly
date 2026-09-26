import { NextRequest, NextResponse } from 'next/server';
import { getEvent, updateEvent } from '@/lib/storage';
import { parseRecipientsCsv } from '@/lib/csv-parser';
import { getActiveOrg } from '@/lib/auth-utils';

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, ctx: Context) {
  try {
    const { organization } = await getActiveOrg();
    const { id } = await ctx.params;
    const event = await getEvent(id, organization.id);
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const parsedRecipients = parseRecipientsCsv(text);
    
    const recipientsWithStatus = parsedRecipients.map(r => ({
      ...r,
      status: 'pending' as const,
    }));

    const updatedEvent = await updateEvent(id, organization.id, { recipients: recipientsWithStatus });
    return NextResponse.json(updatedEvent);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
