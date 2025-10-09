/**
 * 📧 EMAIL TEMPLATES
 * Simple, beautiful email templates for orders
 */

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

/**
 * Order Confirmation Email
 */
export function orderConfirmationEmail(data: OrderEmailData): string {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #374151;">
        <div style="font-weight: 600; color: #f9fafb; margin-bottom: 4px;">${item.name}</div>
        <div style="color: #9ca3af; font-size: 14px;">Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #374151; text-align: right; color: #06b6d4; font-weight: 600;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #06b6d4; font-size: 32px; margin: 0 0 10px 0;">Pulse</h1>
      <p style="color: #9ca3af; margin: 0;">Your Order Has Been Confirmed</p>
    </div>

    <!-- Success Badge -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
      <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
      <h2 style="color: #ffffff; margin: 0 0 10px 0; font-size: 24px;">Order Confirmed!</h2>
      <p style="color: #d1fae5; margin: 0;">Thank you for your purchase, ${data.customerName}</p>
    </div>

    <!-- Order Number -->
    <div style="background-color: #1f2937; border: 2px solid #374151; border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center;">
      <div style="color: #9ca3af; font-size: 14px; margin-bottom: 5px;">Order Number</div>
      <div style="color: #06b6d4; font-size: 24px; font-weight: bold; font-family: monospace;">#${data.orderNumber}</div>
    </div>

    <!-- Order Details -->
    <div style="background-color: #1f2937; border: 2px solid #374151; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
      <h3 style="color: #f9fafb; margin: 0 0 20px 0; font-size: 18px;">Order Details</h3>
      
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
        
        <tr>
          <td style="padding: 12px; padding-top: 20px; color: #9ca3af;">Subtotal</td>
          <td style="padding: 12px; padding-top: 20px; text-align: right; color: #f9fafb;">$${data.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; color: #9ca3af;">Shipping</td>
          <td style="padding: 12px; text-align: right; color: #f9fafb;">
            ${data.shipping === 0 ? '<span style="color: #10b981;">FREE</span>' : `$${data.shipping.toFixed(2)}`}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; padding-top: 20px; border-top: 2px solid #374151; font-weight: 600; color: #f9fafb; font-size: 18px;">Total</td>
          <td style="padding: 12px; padding-top: 20px; border-top: 2px solid #374151; text-align: right; font-weight: 600; color: #06b6d4; font-size: 18px;">$${data.total.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <!-- Shipping Address -->
    <div style="background-color: #1f2937; border: 2px solid #374151; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
      <h3 style="color: #f9fafb; margin: 0 0 15px 0; font-size: 18px;">Shipping Address</h3>
      <div style="color: #9ca3af; line-height: 1.6;">
        <div style="color: #f9fafb; font-weight: 600; margin-bottom: 5px;">${data.customerName}</div>
        <div>${data.shippingAddress.address}</div>
        <div>${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}</div>
        <div>${data.shippingAddress.country}</div>
      </div>
    </div>

    <!-- What's Next -->
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
      <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">📦 What's Next?</h3>
      <div style="color: #dbeafe; line-height: 1.8;">
        <div style="margin-bottom: 10px;">✓ We're processing your order now</div>
        <div style="margin-bottom: 10px;">✓ You'll receive tracking info within 24 hours</div>
        <div style="margin-bottom: 10px;">✓ Expected delivery: 3-5 business days</div>
      </div>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="https://pulse.com/orders/${data.orderNumber}" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Track Your Order
      </a>
    </div>

    <!-- Support -->
    <div style="background-color: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
      <div style="color: #9ca3af; margin-bottom: 10px;">Need Help?</div>
      <div>
        <a href="mailto:support@pulse.com" style="color: #06b6d4; text-decoration: none; font-weight: 600;">support@pulse.com</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; color: #6b7280; font-size: 12px; line-height: 1.6;">
      <p style="margin: 0 0 10px 0;">© 2025 Pulse. All rights reserved.</p>
      <p style="margin: 0 0 10px 0;">
        <a href="https://pulse.com/terms" style="color: #06b6d4; text-decoration: none;">Terms</a> · 
        <a href="https://pulse.com/privacy" style="color: #06b6d4; text-decoration: none;">Privacy</a> · 
        <a href="https://pulse.com/refund" style="color: #06b6d4; text-decoration: none;">Refunds</a>
      </p>
      <p style="margin: 0; color: #4b5563;">
        This email was sent because you placed an order on Pulse.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Order Shipped Email
 */
export function orderShippedEmail(data: { orderNumber: string; customerName: string; trackingNumber: string; carrier: string }): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Shipped</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #06b6d4; font-size: 32px; margin: 0 0 10px 0;">Pulse</h1>
      <p style="color: #9ca3af; margin: 0;">Your Order Is On Its Way!</p>
    </div>

    <!-- Shipped Badge -->
    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
      <div style="font-size: 48px; margin-bottom: 10px;">🚚</div>
      <h2 style="color: #ffffff; margin: 0 0 10px 0; font-size: 24px;">Order Shipped!</h2>
      <p style="color: #ede9fe; margin: 0;">Hi ${data.customerName}, your order is on its way</p>
    </div>

    <!-- Tracking Info -->
    <div style="background-color: #1f2937; border: 2px solid #374151; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="color: #9ca3af; font-size: 14px; margin-bottom: 5px;">Order Number</div>
        <div style="color: #06b6d4; font-size: 20px; font-weight: bold; font-family: monospace;">#${data.orderNumber}</div>
      </div>
      
      <div style="border-top: 1px solid #374151; padding-top: 20px;">
        <div style="color: #9ca3af; font-size: 14px; margin-bottom: 5px;">Tracking Number</div>
        <div style="color: #f9fafb; font-size: 18px; font-weight: bold; font-family: monospace; margin-bottom: 10px;">${data.trackingNumber}</div>
        <div style="color: #9ca3af; font-size: 14px;">Carrier: <span style="color: #f9fafb;">${data.carrier}</span></div>
      </div>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="https://pulse.com/track/${data.trackingNumber}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Track Package
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; color: #6b7280; font-size: 12px;">
      <p style="margin: 0;">© 2025 Pulse. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Simple text version for Order Confirmation
 */
export function orderConfirmationText(data: OrderEmailData): string {
  return `
ORDER CONFIRMATION - Pulse

Hi ${data.customerName},

Thank you for your order! We're excited to get your items to you.

Order Number: #${data.orderNumber}

ORDER DETAILS:
${data.items.map(item => `- ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${data.subtotal.toFixed(2)}
Shipping: ${data.shipping === 0 ? 'FREE' : `$${data.shipping.toFixed(2)}`}
Total: $${data.total.toFixed(2)}

SHIPPING ADDRESS:
${data.customerName}
${data.shippingAddress.address}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
${data.shippingAddress.country}

WHAT'S NEXT:
- We're processing your order now
- You'll receive tracking info within 24 hours
- Expected delivery: 3-5 business days

Track your order: https://pulse.com/orders/${data.orderNumber}

Questions? Contact us at support@pulse.com

Thank you for shopping with Pulse!

© 2025 Pulse. All rights reserved.
  `.trim();
}

export default {
  orderConfirmationEmail,
  orderShippedEmail,
  orderConfirmationText
};
