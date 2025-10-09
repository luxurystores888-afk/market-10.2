
export async function getDynamicPrice(productId: string): Promise<number> {
  // Simple demand-based pricing
  const basePrice = 100; // From DB
  const demandFactor = Math.random() * 0.5 + 1; // 1x to 1.5x
  return basePrice * demandFactor;
}
