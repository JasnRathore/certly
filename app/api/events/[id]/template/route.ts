import { NextRequest, NextResponse } from 'next/server';
import { getEvent, updateEvent } from '@/lib/storage';
import { getPdfDimensions } from '@/lib/pdf-generator';
import { getActiveOrg } from '@/lib/auth-utils';
import { uploadToGitHub, downloadFromGitHub } from '@/lib/github';

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to GitHub instead of local filesystem
    const githubPath = `orgs/${organization.id}/events/${id}/template.pdf`;
    await uploadToGitHub(githubPath, buffer, `Upload template for event ${id}`);
    
    const { width, height } = await getPdfDimensions(buffer);

    const updatedEvent = await updateEvent(id, organization.id, { 
      hasTemplate: true,
      templateWidth: width,
      templateHeight: height
    });

    return NextResponse.json(updatedEvent);
  } catch (err: any) {
    console.error("Template upload error:", err);
    return NextResponse.json({ error: 'Error uploading template' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, ctx: Context) {
  try {
    const { organization } = await getActiveOrg();
    const { id } = await ctx.params;
    const event = await getEvent(id, organization.id);
    if (!event || !event.hasTemplate) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const githubPath = `orgs/${organization.id}/events/${id}/template.pdf`;
    const fileBuffer = await downloadFromGitHub(githubPath);
    
    return new NextResponse(fileBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (err: any) {
    console.error("Template download error:", err);
    return NextResponse.json({ error: 'Error reading template from GitHub' }, { status: 500 });
  }
}
