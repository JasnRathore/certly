import { NextRequest, NextResponse } from 'next/server';
import { getEvent, updateEvent } from '@/lib/storage';
import { sendCertificateEmail } from '@/lib/email-sender';
import { getActiveOrg } from '@/lib/auth-utils';
import { downloadFromGitHub } from '@/lib/github';
import { generateCertificate } from '@/lib/pdf-generator';

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, ctx: Context) {
  try {
    const { user, organization } = await getActiveOrg();
    const { id } = await ctx.params;
    const event = await getEvent(id, organization.id);
    
    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (!organization.gmailAddress || !organization.gmailAppPassword) {
      return NextResponse.json({ error: 'Gmail configuration missing in Settings' }, { status: 400 });
    }

    const githubPath = `orgs/${organization.id}/events/${id}/template.pdf`;
    const templateBuffer = await downloadFromGitHub(githubPath);

    const updatedRecipients = [...event.recipients];

    for (let i = 0; i < updatedRecipients.length; i++) {
      const recipient = updatedRecipients[i];
      
      if (recipient.status === 'generated' || (recipient.status === 'failed' && !recipient.error?.includes('generate'))) {
        try {
          // Generate PDF on the fly!
          const pdfBytes = await generateCertificate(templateBuffer, recipient.name, event.textConfig);
          
          await sendCertificateEmail(
            recipient.email,
            recipient.name,
            event.name,
            event.emailSubject,
            event.emailBody,
            Buffer.from(pdfBytes),
            user.name!,
            organization.gmailAddress,
            organization.gmailAppPassword
          );
          
          recipient.status = 'sent';
          recipient.error = undefined;
        } catch (err: any) {
          recipient.status = 'failed';
          recipient.error = err.message || 'Failed to send email';
        }
      }
    }

    const updatedEvent = await updateEvent(id, organization.id, { 
      status: 'sent',
      recipients: updatedRecipients 
    });

    return NextResponse.json(updatedEvent);
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
