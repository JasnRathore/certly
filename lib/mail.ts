import nodemailer from "nodemailer";

type AppEmailOptions = {
  heading: string;
  preheader: string;
  intro: string;
  code?: string;
  action?: {
    label: string;
    url: string;
  };
  details?: string;
  note?: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function createEmailHtml(options: AppEmailOptions) {
  const actionUrl = options.action ? new URL(options.action.url) : null;
  if (actionUrl && actionUrl.protocol !== "https:" && actionUrl.protocol !== "http:") {
    throw new Error("Email action URL must use HTTP or HTTPS");
  }

  const codeBlock = options.code
    ? `<tr><td style="padding:22px 24px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:10px;text-align:center;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:30px;letter-spacing:5px;color:#171923;">${escapeHtml(options.code)}</td></tr><tr><td height="24" style="height:24px;font-size:0;line-height:0;">&nbsp;</td></tr>`
    : "";
  const actionBlock = options.action && actionUrl
    ? `<tr><td align="left" style="padding:8px 0 22px;"><a href="${escapeHtml(actionUrl.toString())}" style="display:inline-block;padding:14px 24px;border-radius:8px;background:#6254df;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;line-height:20px;text-decoration:none;">${escapeHtml(options.action.label)}</a></td></tr>`
    : "";
  const details = options.details
    ? `<tr><td style="padding:0 0 12px;color:#555b67;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;">${escapeHtml(options.details)}</td></tr>`
    : "";
  const note = options.note
    ? `<tr><td style="padding:14px 0 0;border-top:1px solid #e8e9ed;color:#717784;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:21px;">${escapeHtml(options.note)}</td></tr>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f4f5f7;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(options.preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f5f7;">
      <tr><td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e7e8ec;border-radius:14px;">
          <tr><td style="padding:40px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr><td style="padding:0 0 18px;color:#222431;font-family:Arial,Helvetica,sans-serif;font-size:25px;font-weight:700;line-height:32px;">${escapeHtml(options.heading)}</td></tr>
              <tr><td style="padding:0 0 24px;color:#4f5561;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;">${escapeHtml(options.intro)}</td></tr>
              ${codeBlock}
              ${actionBlock}
              ${details}
              ${note}
            </table>
          </td></tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;">
          <tr><td align="center" style="padding:20px 16px 0;color:#858a95;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;">This is an automated message from Certly. Please do not reply to this email.<br>© ${new Date().getFullYear()} Certly</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function sendAppEmail(
  to: string,
  subject: string,
  text: string,
  options: AppEmailOptions,
) {
  const host = process.env.SMTP_HOST;
  const from = process.env.SMTP_FROM;
  if (!host || !from) {
    throw new Error("Email is not configured");
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: createEmailHtml(options),
  });
}
