const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post('http://localhost:3003/api/testing/reset');

    const userResponse = await request.post('http://localhost:3003/api/users', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        username: 'testuser',
        name: 'Test User',
        password: 'testpassword'
      })
    });

    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.getByTestId('login-form');
    await expect(loginForm).toBeVisible();

    await expect(page.getByTestId('username-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.waitForSelector('[data-testid="login-form"]', { timeout: 10000 });
      await page.getByTestId('username-input').fill('testuser');
      await page.getByTestId('password-input').fill('testpassword');
      await page.getByTestId('login-button').click();

      await expect(page.getByText('testuser logged in')).toBeVisible({ timeout: 10000 });
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username-input').fill('testuser');
      await page.getByTestId('password-input').fill('wrongpassword');
      await page.getByTestId('login-button').click();

      const errorMessage = await page.getByTestId('error-message');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('Wrong username or password');

      await expect(page.getByText('testuser logged in')).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username-input').fill('testuser');
      await page.getByTestId('password-input').fill('testpassword');
      await page.getByTestId('login-button').click();

      await expect(page.getByText('testuser logged in')).toBeVisible({ timeout: 10000 });
    });

    test('a new blog can be created', async ({ page }) => {
      await page.getByText('Create new blog').click();

      await page.getByTestId('title-input').fill('My New Blog');
      await page.getByTestId('author-input').fill('Test Author');
      await page.getByTestId('url-input').fill('https://testblog.com');

      await page.getByTestId('create-blog-button').click();

      const blogItems = await page.getByTestId('blog-item');
      await expect(blogItems.first()).toContainText('My New Blog');
    });
  });
});
