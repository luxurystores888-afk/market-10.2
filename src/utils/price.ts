/**
 * Utility functions for handling price formatting
 * Handles both string (from PostgreSQL decimal) and number price formats
 */

export function formatPrice(price: string | number): string {
  // Convert string to number if needed
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if conversion was successful
  if (isNaN(numericPrice)) {
    console.warn('Invalid price value:', price);
    return '0.00';
  }
  
  return numericPrice.toFixed(2);
}

export function parsePrice(price: string | number): number {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    console.warn('Invalid price value:', price);
    return 0;
  }
  
  return numericPrice;
}