import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/auth/login');
    await expect(page.locator('h1')).toContainText('Sign In');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should register new user', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page).toHaveURL('/auth/register');

    // Fill registration form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'SecurePassword123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!');
    
    // Accept terms
    await page.check('input[name="acceptTerms"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome, Test User')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Navigate to login
    await page.click('text=Sign In');
    
    // Fill login form
    await page.fill('input[name="email"]', 'demo@example.com');
    await page.fill('input[name="password"]', 'DemoPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Navigate to login
    await page.click('text=Sign In');
    
    // Fill login form with invalid credentials
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL('/auth/login');
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.click('text=Sign In');
    await page.fill('input[name="email"]', 'demo@example.com');
    await page.fill('input[name="password"]', 'DemoPassword123!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Click user menu and logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Sign Out');
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('should handle OAuth login', async ({ page }) => {
    await page.click('text=Sign In');
    
    // Check OAuth buttons are visible
    await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
    await expect(page.locator('button:has-text("Continue with GitHub")')).toBeVisible();
    
    // Click Google OAuth (this would redirect to Google in real scenario)
    await page.click('button:has-text("Continue with Google")');
    
    // In test environment, this should show a mock OAuth flow
    await expect(page.locator('text=Redirecting to Google')).toBeVisible();
  });

  test('should enforce password requirements', async ({ page }) => {
    await page.click('text=Sign Up');
    
    // Try weak password
    await page.fill('input[name="password"]', 'weak');
    await page.click('input[name="confirmPassword"]'); // Trigger validation
    
    // Should show password requirements
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
    await expect(page.locator('text=Must contain uppercase letter')).toBeVisible();
    await expect(page.locator('text=Must contain number')).toBeVisible();
    await expect(page.locator('text=Must contain special character')).toBeVisible();
  });

  test('should handle session expiration', async ({ page, context }) => {
    // Login first
    await page.click('text=Sign In');
    await page.fill('input[name="email"]', 'demo@example.com');
    await page.fill('input[name="password"]', 'DemoPassword123!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Clear cookies to simulate session expiration
    await context.clearCookies();
    
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('/auth/login?redirect=/dashboard');
    await expect(page.locator('text=Session expired. Please login again.')).toBeVisible();
  });
});
