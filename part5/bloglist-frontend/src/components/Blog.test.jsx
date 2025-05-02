import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
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
})