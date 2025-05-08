const loginWith = async (page, username, password) => {
  await page.getByTestId('username-input').fill(username);
  await page.getByTestId('password-input').fill(password);
  await page.getByTestId('login-button').click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByText('Create new blog').click();
  await page.getByTestId('title-input').fill(title);
  await page.getByTestId('author-input').fill(author);
  await page.getByTestId('url-input').fill(url);
  await page.getByTestId('create-blog-button').click();
  await page.getByTestId('blog-item').filter({ hasText: title }).waitFor();
};

export { loginWith, createBlog };