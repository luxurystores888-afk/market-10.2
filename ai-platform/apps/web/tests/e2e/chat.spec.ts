import { test, expect } from '@playwright/test';

test.describe('Real-time Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'demo@example.com');
    await page.fill('input[name="password"]', 'DemoPassword123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    
    // Navigate to chat
    await page.click('text=Chat');
    await expect(page).toHaveURL('/chat');
  });

  test('should create new chat room', async ({ page }) => {
    // Click create room button
    await page.click('button:has-text("New Room")');
    
    // Fill room details
    await page.fill('input[name="roomName"]', 'Test Chat Room');
    await page.fill('textarea[name="description"]', 'This is a test chat room');
    
    // Select room type
    await page.selectOption('select[name="roomType"]', 'public');
    
    // Create room
    await page.click('button:has-text("Create Room")');
    
    // Should show new room in list
    await expect(page.locator('text=Test Chat Room')).toBeVisible();
  });

  test('should send and receive messages', async ({ page }) => {
    // Join existing room
    await page.click('text=General Chat');
    
    // Type message
    const testMessage = `Test message ${Date.now()}`;
    await page.fill('input[placeholder="Type a message..."]', testMessage);
    
    // Send message
    await page.press('input[placeholder="Type a message..."]', 'Enter');
    
    // Message should appear in chat
    await expect(page.locator(`text=${testMessage}`)).toBeVisible();
    
    // Check message metadata
    await expect(page.locator('[data-testid="message-timestamp"]').last()).toBeVisible();
    await expect(page.locator('[data-testid="message-status"]').last()).toHaveText('Sent');
  });

  test('should show typing indicators', async ({ page, context }) => {
    // Open chat in two tabs
    const page2 = await context.newPage();
    await page2.goto('/chat');
    await page2.click('text=General Chat');
    
    // Type in first tab
    await page.click('text=General Chat');
    await page.fill('input[placeholder="Type a message..."]', 'Typing...');
    
    // Second tab should show typing indicator
    await expect(page2.locator('text=demo@example.com is typing...')).toBeVisible();
    
    // Clear input
    await page.fill('input[placeholder="Type a message..."]', '');
    
    // Typing indicator should disappear
    await expect(page2.locator('text=demo@example.com is typing...')).not.toBeVisible();
  });

  test('should edit messages', async ({ page }) => {
    // Send a message first
    await page.click('text=General Chat');
    const originalMessage = `Original message ${Date.now()}`;
    await page.fill('input[placeholder="Type a message..."]', originalMessage);
    await page.press('input[placeholder="Type a message..."]', 'Enter');
    
    // Wait for message to appear
    await expect(page.locator(`text=${originalMessage}`)).toBeVisible();
    
    // Hover over message and click edit
    await page.hover(`text=${originalMessage}`);
    await page.click('[data-testid="edit-message"]');
    
    // Edit the message
    const editedMessage = `Edited message ${Date.now()}`;
    await page.fill('[data-testid="message-editor"]', editedMessage);
    await page.press('[data-testid="message-editor"]', 'Enter');
    
    // Check edited message appears
    await expect(page.locator(`text=${editedMessage}`)).toBeVisible();
    await expect(page.locator('text=(edited)')).toBeVisible();
  });

  test('should delete messages', async ({ page }) => {
    // Send a message first
    await page.click('text=General Chat');
    const messageToDelete = `Delete me ${Date.now()}`;
    await page.fill('input[placeholder="Type a message..."]', messageToDelete);
    await page.press('input[placeholder="Type a message..."]', 'Enter');
    
    // Wait for message to appear
    await expect(page.locator(`text=${messageToDelete}`)).toBeVisible();
    
    // Hover over message and click delete
    await page.hover(`text=${messageToDelete}`);
    await page.click('[data-testid="delete-message"]');
    
    // Confirm deletion
    await page.click('button:has-text("Delete")');
    
    // Message should be removed
    await expect(page.locator(`text=${messageToDelete}`)).not.toBeVisible();
    await expect(page.locator('text=Message deleted')).toBeVisible();
  });

  test('should add emoji reactions', async ({ page }) => {
    // Send a message first
    await page.click('text=General Chat');
    const message = `React to me ${Date.now()}`;
    await page.fill('input[placeholder="Type a message..."]', message);
    await page.press('input[placeholder="Type a message..."]', 'Enter');
    
    // Wait for message
    await expect(page.locator(`text=${message}`)).toBeVisible();
    
    // Hover and click reaction button
    await page.hover(`text=${message}`);
    await page.click('[data-testid="add-reaction"]');
    
    // Select emoji
    await page.click('text=👍');
    
    // Reaction should appear
    await expect(page.locator('[data-testid="reaction-👍"]')).toBeVisible();
    await expect(page.locator('[data-testid="reaction-count"]')).toHaveText('1');
  });

  test('should upload files', async ({ page }) => {
    await page.click('text=General Chat');
    
    // Click file upload button
    await page.click('[data-testid="file-upload"]');
    
    // Upload test file
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Test file content')
    });
    
    // File should appear in chat
    await expect(page.locator('text=test.txt')).toBeVisible();
    await expect(page.locator('[data-testid="file-size"]')).toBeVisible();
  });

  test('should search messages', async ({ page }) => {
    await page.click('text=General Chat');
    
    // Send some test messages
    const messages = ['Hello world', 'Test message', 'Search for me'];
    for (const msg of messages) {
      await page.fill('input[placeholder="Type a message..."]', msg);
      await page.press('input[placeholder="Type a message..."]', 'Enter');
    }
    
    // Open search
    await page.click('[data-testid="search-messages"]');
    
    // Search for specific message
    await page.fill('input[placeholder="Search messages..."]', 'Search for me');
    
    // Should highlight matching message
    await expect(page.locator('mark:has-text("Search for me")')).toBeVisible();
    
    // Other messages should be dimmed
    await expect(page.locator('text=Hello world')).toHaveCSS('opacity', '0.5');
  });

  test('should handle AI assistant', async ({ page }) => {
    await page.click('text=General Chat');
    
    // Type AI command
    await page.fill('input[placeholder="Type a message..."]', '/ai What is the weather today?');
    await page.press('input[placeholder="Type a message..."]', 'Enter');
    
    // Should show AI thinking indicator
    await expect(page.locator('[data-testid="ai-thinking"]')).toBeVisible();
    
    // Should receive AI response
    await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="ai-badge"]')).toBeVisible();
  });
});
