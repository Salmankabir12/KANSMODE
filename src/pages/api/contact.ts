import type { APIRoute } from 'astro';
import { z } from 'zod/v4';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues?.[0]?.message || 'Invalid input';
      return new Response(JSON.stringify({ error: message }), { status: 400 });
    }

    const { name, email, phone, subject, message } = parsed.data;
    const runtime = (locals as any).runtime;
    const db = runtime?.env?.DB;

    if (!db) {
      return new Response(JSON.stringify({ error: 'Database binding missing' }), { status: 500 });
    }

    const result = await db
      .prepare('INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)')
      .bind(name, email, phone || null, subject || null, message)
      .run();

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to save message' }), { status: 500 });
    }

    const resendKey = runtime?.env?.RESEND_API_KEY;
    const adminEmail = runtime?.env?.ADMIN_EMAIL || 'info@kansmode.com';
    const fromEmail = 'contact@kansmode.com';

    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: adminEmail,
            subject: `New contact form submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`,
          }),
        });
      } catch (e) {
        console.error('Failed to send email notification', e);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
