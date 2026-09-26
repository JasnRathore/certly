import { NextRequest, NextResponse } from 'next/server';
import { getEvent } from '@/lib/storage';
import { getActiveOrg } from '@/lib/auth-utils';
import { downloadFromGitHub } from '@/lib/github';
import { generateCertificate } from '@/lib/pdf-generator';

type Context = {
  params: Promise<{ id: string; recipientIndex: string }>;
};

export async function GET(req: NextRequest, ctx: Context) {
  try {
    const { organization } = await getActiveOrg();
    const { id, recipientIndex } = await ctx.params;
    const event = await getEvent(id, organization.id);
    
    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const index = parseInt(recipientIndex, 10);
    if (isNaN(index) || index < 0 || index >= event.recipients.length) {
      return NextResponse.json({ error: 'Invalid recipient index' }, { status: 400 });
    }
    
    const recipient = event.recipients[index];

    try {
      const githubPath = `orgs/${organization.id}/events/${id}/template.pdf`;
      const templateBuffer = await downloadFromGitHub(githubPath);
      
      const pdfBytes = await generateCertificate(templateBuffer, recipient.name, event.textConfig);
      
      // Need to cast to any/unknown to avoid TS buffer issues in Next.js response body types
      return new NextResponse(pdfBytes as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
    } catch (err) {
      return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
