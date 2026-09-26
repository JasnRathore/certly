import { NextRequest, NextResponse } from 'next/server';
import { getEvent, updateEvent } from '@/lib/storage';
import { generateCertificate } from '@/lib/pdf-generator';
import { getActiveOrg } from '@/lib/auth-utils';
import { downloadFromGitHub } from '@/lib/github';

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, ctx: Context) {
  try {
    const { organization } = await getActiveOrg();
    const { id } = await ctx.params;
    const event = await getEvent(id, organization.id);
    
    if (!event || !event.hasTemplate) {
      return NextResponse.json({ error: 'Not found or no template' }, { status: 404 });
    }

    const githubPath = `orgs/${organization.id}/events/${id}/template.pdf`;
    const templateBuffer = await downloadFromGitHub(githubPath);
    
    const updatedRecipients = [...event.recipients];

    for (let i = 0; i < updatedRecipients.length; i++) {
      const recipient = updatedRecipients[i];
      try {
        // Generate on the fly to validate, but don't store locally!
        await generateCertificate(templateBuffer, recipient.name, event.textConfig);
        recipient.status = 'generated';
        recipient.error = undefined;
      } catch (err: any) {
        recipient.status = 'failed';
        recipient.error = err.message || 'Failed to generate PDF';
      }
    }

    const updatedEvent = await updateEvent(id, organization.id, { 
      status: 'generated',
      recipients: updatedRecipients 
    });

    return NextResponse.json(updatedEvent);
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
