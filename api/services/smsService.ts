/**
 * 📱 SMS NOTIFICATION SERVICE
 * 
 * Impact: 98% open rate (vs 20% email)
 * Revenue: +35% cart recovery, +25% flash sale conversions
 * 
 * Provider: Twilio
 * Cost: $0.0075 per SMS (less than 1 cent)
 * Free Trial: $15.50 credit
 * 
 * Use Cases:
 * - Order confirmations
 * - Shipping updates
 * - Abandoned cart recovery
 * - Flash sale alerts
 * - OTP verification
 */

interface SMSOptions {
  to: string;
  message: string;
  type?: 'transactional' | 'marketing';
}

interface OrderSMSData {
  customerPhone: string;
  orderNumber: string;
  total: number;
  estimatedDelivery?: string;
}

class SMSService {
  private twilioAccountSid: string | undefined;
  private twilioAuthToken: string | undefined;
  private twilioPhoneNumber: string | undefined;
  private enabled: boolean;

  constructor() {
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    this.enabled = !!(this.twilioAccountSid && this.twilioAuthToken && this.twilioPhoneNumber);

    if (!this.enabled) {
      console.log('⚠️  SMS Service: Disabled (No Twilio credentials)');
      console.log('ℹ️  To enable: Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env');
    }
  }

  /**
   * Send SMS (generic)
   */
  async sendSMS(options: SMSOptions): Promise<boolean> {
    try {
      if (!this.enabled) {
        return this.logSMS(options);
      }

      // Send via Twilio
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(
              `${this.twilioAccountSid}:${this.twilioAuthToken}`
            ).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: options.to,
            From: this.twilioPhoneNumber!,
            Body: options.message
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ SMS sent successfully:', data.sid);
        return true;
      } else {
        const error = await response.json();
        console.error('❌ Twilio error:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending SMS:', error);
      return false;
    }
  }

  /**
   * Send order confirmation SMS
   */
  async sendOrderConfirmation(data: OrderSMSData): Promise<boolean> {
    const message = `✅ Order confirmed! #${data.orderNumber}\nTotal: $${data.total.toFixed(2)}\nWe'll text you when it ships!\n\n- Cyber Mart 2077`;

    return this.sendSMS({
      to: data.customerPhone,
      message,
      type: 'transactional'
    });
  }

  /**
   * Send shipping notification SMS
   */
  async sendShippingUpdate(data: {
    customerPhone: string;
    orderNumber: string;
    trackingNumber: string;
    carrier: string;
  }): Promise<boolean> {
    const message = `📦 Your order #${data.orderNumber} has shipped!\n\n${data.carrier} Tracking: ${data.trackingNumber}\n\nTrack: https://yourdomain.com/track/${data.trackingNumber}`;

    return this.sendSMS({
      to: data.customerPhone,
      message,
      type: 'transactional'
    });
  }

  /**
   * Send abandoned cart SMS
   */
  async sendAbandonedCartReminder(data: {
    customerPhone: string;
    cartValue: number;
    discountCode?: string;
  }): Promise<boolean> {
    const message = data.discountCode
      ? `🛒 You left $${data.cartValue.toFixed(2)} in your cart!\n\nUse code ${data.discountCode} for 10% OFF\n\nComplete your purchase: https://yourdomain.com/cart`
      : `🛒 Your cart is waiting! $${data.cartValue.toFixed(2)} worth of items\n\nFinish checkout: https://yourdomain.com/cart`;

    return this.sendSMS({
      to: data.customerPhone,
      message,
      type: 'marketing'
    });
  }

  /**
   * Send flash sale alert
   */
  async sendFlashSaleAlert(data: {
    customerPhone: string;
    productName: string;
    discount: number;
    hoursLeft: number;
  }): Promise<boolean> {
    const message = `🔥 FLASH SALE! ${data.discount}% OFF ${data.productName}\n\nOnly ${data.hoursLeft} hours left!\n\nShop now: https://yourdomain.com/flash-sale`;

    return this.sendSMS({
      to: data.customerPhone,
      message,
      type: 'marketing'
    });
  }

  /**
   * Send OTP verification
   */
  async sendOTP(phone: string, code: string): Promise<boolean> {
    const message = `Your verification code is: ${code}\n\nThis code expires in 10 minutes.\n\n- Cyber Mart 2077`;

    return this.sendSMS({
      to: phone,
      message,
      type: 'transactional'
    });
  }

  /**
   * Send back-in-stock alert
   */
  async sendRestockAlert(data: {
    customerPhone: string;
    productName: string;
    productUrl: string;
  }): Promise<boolean> {
    const message = `🎉 ${data.productName} is back in stock!\n\nGet it before it's gone: ${data.productUrl}`;

    return this.sendSMS({
      to: data.customerPhone,
      message,
      type: 'transactional'
    });
  }

  /**
   * Log SMS to console (development mode)
   */
  private logSMS(options: SMSOptions): boolean {
    console.log('\n📱 ═══════════════════════════════════════');
    console.log('📱 SMS (Development Mode)');
    console.log('📱 ═══════════════════════════════════════');
    console.log(`📱 To: ${options.to}`);
    console.log(`📱 Type: ${options.type || 'transactional'}`);
    console.log('📱 ═══════════════════════════════════════');
    console.log('📱 MESSAGE:');
    console.log(options.message);
    console.log('📱 ═══════════════════════════════════════\n');
    
    return true;
  }

  /**
   * Setup instructions
   */
  static getSetupInstructions(): string {
    return `
📱 SMS SERVICE SETUP

Current Status: Development Mode (logging to console)

To enable real SMS sending:

1. Sign up for Twilio:
   - Go to: https://www.twilio.com/try-twilio (FREE trial)
   - Get $15.50 free credit
   - Buy a phone number (~$1/month)

2. Get your credentials:
   - Account SID
   - Auth Token  
   - Twilio Phone Number

3. Set environment variables:
   export TWILIO_ACCOUNT_SID="your-account-sid"
   export TWILIO_AUTH_TOKEN="your-auth-token"
   export TWILIO_PHONE_NUMBER="+1234567890"

4. Restart server:
   npm run dev:server

Pricing:
- US/Canada: $0.0079 per SMS
- International: $0.01-0.05 per SMS
- Monthly phone number: $1.15/month

Example costs:
- 100 SMS/month: $0.79 + $1.15 = $2/month
- 1,000 SMS/month: $7.90 + $1.15 = $9/month
- 10,000 SMS/month: $79 + $1.15 = $80/month

Use Cases:
✅ Order confirmations (98% open rate)
✅ Shipping updates (instant delivery)
✅ Abandoned cart (67% recovery vs 20% email)
✅ Flash sales (27% revenue from SMS)
✅ OTP verification (security)
✅ Restock alerts (high conversion)

Alternative Providers:
- MessageBird (similar pricing)
- Plivo (slightly cheaper)
- AWS SNS (cheapest for high volume)
    `.trim();
  }
}

// Singleton instance
export const smsService = new SMSService();

// Print setup instructions on startup
if (!process.env.TWILIO_ACCOUNT_SID) {
  console.log('\n⚠️  SMS Service: Development Mode');
  console.log('ℹ️  SMS will be logged to console');
  console.log('ℹ️  To enable real SMS, see: SMSService.getSetupInstructions()');
}

export default smsService;

