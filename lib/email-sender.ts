import nodemailer from 'nodemailer';

export async function sendCertificateEmail(
  recipientEmail: string,
  recipientName: string,
  eventName: string,
  subjectTemplate: string,
  bodyTemplate: string,
  pdfBuffer: Uint8Array,
  senderName: string,
  gmailAddress: string,
  gmailAppPassword: string
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailAddress,
      pass: gmailAppPassword,
    },
  });

  const subject = subjectTemplate
    .replace(/{name}/g, recipientName)
    .replace(/{event}/g, eventName);

  const body = bodyTemplate
    .replace(/{name}/g, recipientName)
    .replace(/{event}/g, eventName);

  await transporter.sendMail({
    from: `"${senderName}" <${gmailAddress}>`,
    to: recipientEmail,
    subject: subject,
    text: body,
    attachments: [
      {
        filename: `${eventName} - Certificate.pdf`,
        content: Buffer.from(pdfBuffer),
        contentType: 'application/pdf',
      },
    ],
  });
}
