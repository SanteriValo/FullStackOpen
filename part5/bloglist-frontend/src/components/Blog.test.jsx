import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {
  it('renders title and author, but not url or likes by default', () => {
    const blog = {
      id: '123',
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5,
      user: {
        username: 'testuser',
        id: '456',
      },
    }

    const mockUpdateBlog = vi.fn()
    const mockDeleteBlog = vi.fn()
    const mockCurrentUser = { username: 'testuser', token: 'mocktoken' }

    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        currentUser={mockCurrentUser}
      />
    )

    const titleElement = screen.getByText('Test Blog Title')
    const authorElement = screen.getByText('Test Author')
    expect(titleElement).toBeInTheDocument()
    expect(authorElement).toBeInTheDocument()

    const urlElement = screen.queryByText('http://test.com')
    const likesElement = screen.queryByText('likes: 5')
    expect(urlElement).not.toBeInTheDocument()
    expect(likesElement).not.toBeInTheDocument()
  })

  it('shows url and likes when the view button is clicked', async () => {
    const blog = {
      id: '123',
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5,
      user: {
        username: 'testuser',
        id: '456',
      },
    }

    const mockUpdateBlog = vi.fn()
    const mockDeleteBlog = vi.fn()
    const mockCurrentUser = { username: 'testuser', token: 'mocktoken' }

    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        currentUser={mockCurrentUser}
      />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const urlElement = screen.getByText('http://test.com')
    const likesElement = screen.getByText('likes: 5')
    expect(urlElement).toBeInTheDocument()
    expect(likesElement).toBeInTheDocument()
  })
})