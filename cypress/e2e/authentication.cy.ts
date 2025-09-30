describe('User Authentication', () => {
  beforeEach(() => {
    cy.clearTestData();

    // Mock API responses
    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'customer',
        },
        token: 'fake-jwt-token',
      },
    }).as('loginRequest');

    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/register`, {
      statusCode: 201,
      body: {
        user: {
          id: '2',
          email: 'newuser@example.com',
          name: 'New User',
          role: 'customer',
        },
        token: 'fake-jwt-token',
      },
    }).as('registerRequest');

    cy.visit('/');
  });

  it('displays login/register buttons when not authenticated', () => {
    // Should show login and register buttons in header
    cy.contains('Login').should('be.visible');
    cy.contains('Register').should('be.visible');
  });

  it('allows user to login successfully', () => {
    // Click login button
    cy.contains('Login').click();

    // Should navigate to login page
    cy.url().should('include', '/login');

    // Fill in login form
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');

    // Submit form
    cy.get('[data-testid="login-button"]').click();

    // Wait for API call
    cy.wait('@loginRequest');

    // Should redirect to homepage and show user info
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Test User').should('be.visible');
    cy.contains('Logout').should('be.visible');
  });

  it('allows user to register successfully', () => {
    // Click register button
    cy.contains('Register').click();

    // Should navigate to register page
    cy.url().should('include', '/register');

    // Fill in registration form
    cy.get('[data-testid="name-input"]').type('New User');
    cy.get('[data-testid="email-input"]').type('newuser@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="confirm-password-input"]').type('password123');

    // Submit form
    cy.get('[data-testid="register-button"]').click();

    // Wait for API call
    cy.wait('@registerRequest');

    // Should redirect to homepage and show user info
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('New User').should('be.visible');
    cy.contains('Logout').should('be.visible');
  });

  it('shows validation errors for invalid login', () => {
    cy.contains('Login').click();
    cy.url().should('include', '/login');

    // Try to login with empty fields
    cy.get('[data-testid="login-button"]').click();

    // Should show validation errors
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('shows validation errors for invalid registration', () => {
    cy.contains('Register').click();
    cy.url().should('include', '/register');

    // Try to register with mismatched passwords
    cy.get('[data-testid="name-input"]').type('New User');
    cy.get('[data-testid="email-input"]').type('newuser@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="confirm-password-input"]').type('differentpassword');

    cy.get('[data-testid="register-button"]').click();

    // Should show validation error
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('handles login failure gracefully', () => {
    // Mock failed login response
    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
      statusCode: 401,
      body: {
        error: 'Invalid credentials',
      },
    }).as('failedLogin');

    cy.contains('Login').click();

    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');

    cy.get('[data-testid="login-button"]').click();

    cy.wait('@failedLogin');

    // Should show error message
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('allows user to logout', () => {
    // First login
    cy.contains('Login').click();
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@loginRequest');

    // Should show user info
    cy.contains('Test User').should('be.visible');

    // Click logout
    cy.contains('Logout').click();

    // Should redirect to homepage and show login/register buttons
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Login').should('be.visible');
    cy.contains('Register').should('be.visible');
    cy.contains('Test User').should('not.exist');
  });

  it('maintains authentication state across page refreshes', () => {
    // Login
    cy.contains('Login').click();
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@loginRequest');

    // Refresh page
    cy.reload();

    // Should still be logged in
    cy.contains('Test User').should('be.visible');
    cy.contains('Logout').should('be.visible');
  });

  it('protects authenticated routes', () => {
    // Try to visit profile page without being logged in
    cy.visit('/profile');

    // Should redirect to login page
    cy.url().should('include', '/login');
    cy.contains('Please log in to access this page').should('be.visible');
  });

  it('allows access to protected routes after login', () => {
    // Login first
    cy.contains('Login').click();
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@loginRequest');

    // Navigate to profile page
    cy.visit('/profile');

    // Should be able to access profile
    cy.url().should('include', '/profile');
    cy.contains('Profile Settings').should('be.visible');
  });

  it('has proper accessibility on auth forms', () => {
    cy.contains('Login').click();

    // Check form accessibility
    cy.get('[data-testid="email-input"]').should('have.attr', 'aria-label');
    cy.get('[data-testid="password-input"]').should('have.attr', 'aria-label');
    cy.get('[data-testid="login-button"]').should('have.attr', 'aria-label');

    // Check for proper form structure
    cy.get('form').should('have.attr', 'noValidate', 'false');
  });
});
