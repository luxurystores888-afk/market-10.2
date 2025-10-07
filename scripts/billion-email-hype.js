// Billion Email Hype (free mock)
const nodemailer = require('nodemailer');

// Mock transport (use free Gmail in real)
const transport = nodemailer.createTransport({ service: 'gmail', auth: { user: 'test@gmail.com', pass: 'test' } });

// Generate and "send" 1000 emails
for (let i = 0; i < 1000; i++) {
  const mail = {
    from: 'pulse@free.com',
    to: `user${i}@mock.com`,
    subject: 'Billion Launch - Join Now!',
    text: 'Free riches on PULSE!'
  };
  console.log(`Sent email #${i}`);
}

// In real, transport.sendMail(mail);
