<<<<<<< Updated upstream
import nodemailer from 'nodemailer';
import { db } from '../db';
import { subscribers } from '../../lib/schema';
=======
/**
 * 📧 EMAIL SERVICE
 * 
 * Simple email service with templates
 * Can be connected to SendGrid, SMTP, or any email provider
 */
>>>>>>> Stashed changes

import { orderConfirmationEmail, orderConfirmationText, orderShippedEmail, type OrderEmailData } from '../utils/emailTemplates.ts';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private sendGridApiKey: string | undefined;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.sendGridApiKey = process.env.SENDGRID_API_KEY;
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@pulse.com';
    this.fromName = process.env.FROM_NAME || 'Pulse';
  }

  /**
   * Send email (generic)
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (this.sendGridApiKey) {
        // TODO: Implement SendGrid integration
        return await this.sendViaSendGrid(options);
      } else {
        // Development mode - log to console
        return this.logEmail(options);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
    const html = orderConfirmationEmail(data);
    const text = orderConfirmationText(data);

    return this.sendEmail({
      to: data.customerEmail,
      subject: `Order Confirmation #${data.orderNumber} - Pulse`,
      html,
      text
    });
  }

  /**
   * Send order shipped notification
   */
  async sendOrderShipped(data: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    trackingNumber: string;
    carrier: string;
  }): Promise<boolean> {
    const html = orderShippedEmail(data);

    return this.sendEmail({
      to: data.customerEmail,
      subject: `Your Order #${data.orderNumber} Has Shipped! 📦`,
      html
    });
  }

  /**
   * Send via SendGrid (when API key is available)
   */
  private async sendViaSendGrid(options: EmailOptions): Promise<boolean> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendGridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: options.to }]
          }],
          from: {
            email: this.fromEmail,
            name: this.fromName
          },
          subject: options.subject,
          content: [
            {
              type: 'text/html',
              value: options.html
            },
            ...(options.text ? [{
              type: 'text/plain',
              value: options.text
            }] : [])
          ]
        })
      });

      if (response.ok) {
        console.log('✅ Email sent successfully via SendGrid:', options.to);
        return true;
      } else {
        const error = await response.text();
        console.error('❌ SendGrid error:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending via SendGrid:', error);
      return false;
    }
  }

  /**
   * Log email to console (development mode)
   */
  private logEmail(options: EmailOptions): boolean {
    console.log('\n📧 ═══════════════════════════════════════');
    console.log('📧 EMAIL (Development Mode)');
    console.log('📧 ═══════════════════════════════════════');
    console.log(`📧 To: ${options.to}`);
    console.log(`📧 Subject: ${options.subject}`);
    console.log('📧 ═══════════════════════════════════════');
    
    if (options.text) {
      console.log('📧 TEXT VERSION:');
      console.log(options.text);
      console.log('📧 ───────────────────────────────────────');
    }
    
    console.log('📧 HTML VERSION (first 500 chars):');
    console.log(options.html.substring(0, 500) + '...');
    console.log('📧 ═══════════════════════════════════════\n');
    
    // In development, always return true
    return true;
  }

  /**
   * Setup instructions
   */
  static getSetupInstructions(): string {
    return `
📧 EMAIL SERVICE SETUP

Current Status: Development Mode (logging to console)

To enable real email sending:

1. Get SendGrid API Key:
   - Sign up at https://sendgrid.com (Free: 100 emails/day)
   - Get API key from Settings > API Keys
   
2. Set environment variables:
   export SENDGRID_API_KEY="your-api-key-here"
   export FROM_EMAIL="noreply@yourdomain.com"
   export FROM_NAME="Your Company Name"

3. Restart server
   npm run dev:server

Alternative Email Providers:
- AWS SES (very cheap, $0.10 per 1000 emails)
- Mailgun (5,000 free emails/month)
- Postmark (100 free emails/month)
- SMTP (Gmail, etc.)

For production, we recommend SendGrid or AWS SES.
    `.trim();
  }
}

// Singleton instance
export const emailService = new EmailService();

// Print setup instructions on startup
if (!process.env.SENDGRID_API_KEY) {
  console.log('\n⚠️  Email Service: Development Mode');
  console.log('ℹ️  Emails will be logged to console');
  console.log('ℹ️  To enable real emails, see: EmailService.getSetupInstructions()');
}

export default emailService;