// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createTestProduct(productData: any): Chainable<void>;
      clearTestData(): Chainable<void>;
      shouldHaveAccessibilityViolations(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('shouldHaveAccessibilityViolations', () => {
  // This would integrate with aXe-core for accessibility testing
  // For now, just a placeholder
  cy.log('Accessibility check would run here');
});

// Custom command to check if element is visible and accessible
Cypress.Commands.add('isVisible', { prevSubject: 'element' }, (subject) => {
  const isVisible = Cypress.dom.isVisible(subject);
  expect(isVisible).to.be.true;
  return subject;
});

// Custom command to wait for API response
Cypress.Commands.add('waitForApi', (url: string, method = 'GET') => {
  cy.intercept(method, url).as('apiCall');
  cy.wait('@apiCall');
});

// Custom command to handle loading states
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
});

// Example of overwriting the built-in 'contains' command
// Cypress.Commands.overwrite('contains', (originalFn, subject, filter, text, options = {}) => {
//   // Add custom logic here
//   return originalFn(subject, filter, text, options);
// });

export {};
