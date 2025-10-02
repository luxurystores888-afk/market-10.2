// Legal affiliate with disclosure
async function generateAffiliateLink(userId) {
  return `yoursite.com?aff=${userId}`;
}

async function trackAffiliateSale(affId, amount) {
  // Pay 10% commission legally
  addLoyaltyPoints(amount * 0.1);
}
