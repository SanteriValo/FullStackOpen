const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        username: 'testuser',
        name: 'Test User',
        password: 'testpassword',
      }),
    });
    await request.post('http://localhost:3003/api/users', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        username: 'otheruser',
        name: 'Other User',
        password: 'otherpassword',
      }),
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
      await loginWith(page, 'testuser', 'testpassword');
      await expect(page.getByText('testuser logged in')).toBeVisible({ timeout: 10000 });
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpassword');
      const errorMessage = await page.getByTestId('error-message');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('Wrong username or password');
      await expect(page.getByText('testuser logged in')).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword');
      await expect(page.getByText('testuser logged in')).toBeVisible({ timeout: 15000 });
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'My New Blog', 'Test Author', 'https://testblog.com');
      const blogItem = await page.getByTestId('blog-item').filter({ hasText: 'My New Blog' });
      await expect(blogItem).toBeVisible({ timeout: 10000 });
      await expect(blogItem).toContainText('My New Blog');
    });

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Liking Blog Test', 'Tester', 'http://testblog.com');
      const blog = page.getByTestId('blog-item').filter({ hasText: 'Liking Blog Test' });
      await blog.getByRole('button', { name: 'view' }).click();
      const likeButton = blog.getByRole('button', { name: 'like' });
      const likesText = await blog.getByText(/likes: \d+/);
      const initialLikes = parseInt((await likesText.innerText()).match(/\d+/)[0]);
      await likeButton.click();
      const updatedLikesText = await blog.getByText(`likes: ${initialLikes + 1}`);
      await expect(updatedLikesText).toBeVisible({ timeout: 5000 });
    });

    test('a blog can be removed by the creator', async ({ page }) => {
      await createBlog(page, 'Blog to Delete', 'Test Author', 'https://deleteblog.com');
      const blog = page.getByTestId('blog-item').filter({ hasText: 'Blog to Delete' });
      await blog.getByRole('button', { name: 'view' }).click();
      // Handle window.confirm dialog
      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });
      await blog.getByRole('button', { name: 'remove' }).click();
      await expect(page.getByTestId('blog-item').filter({ hasText: 'Blog to Delete' })).not.toBeVisible({ timeout: 5000 });
    });
  });
});