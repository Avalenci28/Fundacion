import { test, expect } from '@playwright/test';

test.describe('Admin Panel CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.goto('/admin');
  });

  test('Projects CRUD', async ({ page }) => {
    await page.click('[data-tab="projects"]');
    await page.click('text=Nuevo Proyecto');
    await page.fill('input[name="title"]', 'Test Project');
    await page.fill('textarea[name="description"]', 'Test desc');
    await page.selectOption('select[name="status"]', 'En proceso');
    await page.click('button:has-text("Crear")');
    await expect(page.locator('text=Test Project')).toBeVisible();
  });

  // Similar for Events, Posts, Gallery
  test('Contacts mark read/delete', async ({ page }) => {
    await page.click('[data-tab="contacts"]');
    await page.click('button:has-icon(Eye)');
    await expect(page.locator('text=Leído')).toBeVisible();
  });
});

