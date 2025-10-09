describe('Product Browsing', () => {
  beforeEach(() => {
    // Clear any existing test data
    cy.clearTestData();

    // Mock API responses
    cy.intercept('GET', `${Cypress.env('apiUrl')}/products`, {
      products: [
        {
          id: '1',
          name: 'Cyberpunk Gaming Headset',
          description: 'Immersive 7.1 surround sound gaming headset',
          price: '299.99',
          category: 'Electronics',
          imageUrl: 'https://example.com/headset.jpg',
          stock: 15,
          status: 'active',
          tags: ['gaming', 'audio', 'cyberpunk'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Neural Interface Glasses',
          description: 'AR glasses with neural interface capabilities',
          price: '899.99',
          category: 'Electronics',
          imageUrl: 'https://example.com/glasses.jpg',
          stock: 3,
          status: 'active',
          tags: ['AR', 'neural', 'tech'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }).as('getProducts');

    cy.visit('/');
  });

  it('displays the homepage with header and product grid', () => {
    // Check header is visible
    cy.contains('CYBER MART 2077').should('be.visible');

    // Check navigation links
    cy.contains('Products').should('be.visible');
    cy.contains('AI Chat').should('be.visible');
    cy.contains('Automation').should('be.visible');

    // Check search functionality
    cy.get('[data-testid="search-input"]').should('be.visible');

    // Wait for products to load
    cy.wait('@getProducts');

    // Check products are displayed
    cy.contains('Cyberpunk Gaming Headset').should('be.visible');
    cy.contains('Neural Interface Glasses').should('be.visible');
  });

  it('allows searching for products', () => {
    cy.get('[data-testid="search-input"]').type('headset');

    // Should filter to show only headset product
    cy.contains('Cyberpunk Gaming Headset').should('be.visible');
    cy.contains('Neural Interface Glasses').should('not.exist');
  });

  it('displays product details when clicking on a product', () => {
    cy.contains('Cyberpunk Gaming Headset').click();

    // Should navigate to product detail page
    cy.url().should('include', '/product/1');

    // Check product details are displayed
    cy.contains('Cyberpunk Gaming Headset').should('be.visible');
    cy.contains('$299.99').should('be.visible');
    cy.contains('Immersive 7.1 surround sound gaming headset').should('be.visible');
    cy.contains('15 in stock').should('be.visible');
  });

  it('shows out of stock indicator for low stock items', () => {
    // The Neural Interface Glasses has only 3 stock, should show low stock warning
    cy.contains('Neural Interface Glasses').should('be.visible');

    // Check for low stock indicator (this would depend on your component implementation)
    cy.get('[data-testid="low-stock-indicator"]').should('be.visible');
  });

  it('allows adding products to cart', () => {
    cy.contains('Cyberpunk Gaming Headset').click();

    // Add to cart button should be visible and clickable
    cy.get('[data-testid="add-to-cart-button"]').should('be.visible').click();

    // Should show success message or cart update
    cy.contains('Added to cart').should('be.visible');

    // Cart icon should show updated count
    cy.get('[data-testid="cart-count"]').should('contain', '1');
  });

  it('allows adding products to wishlist', () => {
    cy.contains('Cyberpunk Gaming Headset').click();

    // Add to wishlist button should be visible and clickable
    cy.get('[data-testid="add-to-wishlist-button"]').should('be.visible').click();

    // Should show success message
    cy.contains('Added to wishlist').should('be.visible');
  });

  it('filters products by category', () => {
    // Click on Electronics category filter
    cy.contains('Electronics').click();

    // Both products should be visible since they're both Electronics
    cy.contains('Cyberpunk Gaming Headset').should('be.visible');
    cy.contains('Neural Interface Glasses').should('be.visible');
  });

  it('displays product tags', () => {
    // Check that product tags are displayed
    cy.contains('#gaming').should('be.visible');
    cy.contains('#audio').should('be.visible');
    cy.contains('#cyberpunk').should('be.visible');
  });

  it('handles empty search results gracefully', () => {
    cy.get('[data-testid="search-input"]').type('nonexistent product');

    // Should show no results message
    cy.contains('No products found').should('be.visible');
  });

  it('maintains accessibility standards', () => {
    // Check for proper ARIA labels and semantic HTML
    cy.get('[data-testid="search-input"]').should('have.attr', 'aria-label');
    cy.get('[data-testid="add-to-cart-button"]').should('have.attr', 'aria-label');

    // Check for keyboard navigation support
    cy.get('[data-testid="search-input"]').focus().should('have.focus');
  });
});
