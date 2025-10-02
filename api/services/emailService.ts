import nodemailer from 'nodemailer';
import { db } from '../db';
import { subscribers } from '../db/schema';

let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null; // graceful fallback
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
  return transporter;
}

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const tx = getEmailTransporter();
  if (!tx) {
    console.log('[Email disabled] Would send:', opts.subject, 'to', opts.to);
    return;
  }
  await tx.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@pulse.local',
    to: opts.to,
    subject: opts.subject,
    html: opts.html
  });
}

// Add newsletter functions
async function subscribeToNewsletter(email) {
  // Save to DB
  await db.insert(subscribers).values({ email });
}

async function sendNewsletter(subject, html) {
  const subscribers = await db.select().from(subscribers);
  for (const sub of subscribers) {
    await sendEmail({ to: sub.email, subject, html });
  }
}

// Add function
async function sendUpsellEmail(to, products) {
  const html = `<h1>Thanks for your purchase! Add these for more savings: ${products.join(', ')}</h1>`;
  await sendEmail({ to, subject: 'Don't Miss These Add-Ons', html });
}

export { subscribeToNewsletter, sendNewsletter };


