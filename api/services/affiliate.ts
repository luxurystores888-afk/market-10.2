// Legal affiliate with disclosure
export async function generateAffiliateLink(userId: string) {
  return `yoursite.com?aff=${userId}`;
}

export async function trackAffiliateSale(affId: string, amount: number) {
  // Pay 10% commission legally
  // addLoyaltyPoints(amount * 0.1);
  console.log(`Tracked sale for affiliate ${affId}: $${amount}`);
}
