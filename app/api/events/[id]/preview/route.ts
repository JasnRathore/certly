import { NextRequest, NextResponse } from 'next/server';
import { getEvent } from '@/lib/storage';
import { generateCertificate } from '@/lib/pdf-generator';
import { getActiveOrg } from '@/lib/auth-utils';
import { downloadFromGitHub } from '@/lib/github';

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, ctx: Context) {
  try {
    const { organization } = await getActiveOrg();
    const { id } = await ctx.params;
    const event = await getEvent(id, organization.id);
    if (!event || !event.hasTemplate) {
      return NextResponse.json({ error: 'Not found or no template' }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const configParam = searchParams.get('config');
    let config = event.textConfig;
    if (configParam) {
      try {
        config = JSON.parse(configParam);
      } catch (e) {}
    }

    const githubPath = `orgs/${organization.id}/events/${id}/template.pdf`;
    const templateBuffer = await downloadFromGitHub(githubPath);
    
    const pdfBytes = await generateCertificate(templateBuffer, 'John Doe', config);
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Error generating preview' }, { status: 500 });
  }
}
