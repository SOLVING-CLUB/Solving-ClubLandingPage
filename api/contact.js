import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, company, service, details } = req.body || {};

  if (!email || !details) {
    return res.status(400).json({ error: 'Email and details are required' });
  }

  try {
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'SolvingClub <no-reply@solvingclub.org>',
      to: process.env.CONTACT_TO_EMAIL || 'contactus@solvingclub.org',
      subject: 'New contact form submission',
      text: `
Name: ${firstName || ''} ${lastName || ''}
Email: ${email}
Company/Project: ${company || '-'}
Service: ${service || '-'}

Details:
${details}
      `.trim(),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

