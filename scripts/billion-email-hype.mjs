// Billion Email Hype (free mock)
import nodemailer from 'nodemailer';

// Mock transport
const transport = nodemailer.createTransport({ service: 'gmail', auth: { user: 'test@gmail.com', pass: 'test' } });

// Generate 1000 emails
for (let i = 0; i < 1000; i++) {
  const mail = {
    from: 'pulse@free.com',
    to: `user${i}@mock.com`,
    subject: 'Billion Launch - Join Now!',
    text: 'Free riches on PULSE!'
  };
  console.log(`Mock sent email #${i}`);
}

// For real: transport.sendMail(mail);
