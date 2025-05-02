import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

describe('Blog component', () => {
  let blog
  let mockUpdateBlog
  let mockDeleteBlog
  let mockCurrentUser

  beforeEach(() => {
    blog = {
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

    mockUpdateBlog = vi.fn()
    mockDeleteBlog = vi.fn()
    mockCurrentUser = { username: 'testuser', token: 'mocktoken' }
  })

  it('renders title and author but not url or likes by default', () => {
    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        currentUser={mockCurrentUser}
      />
    )

    expect(screen.getByText('Test Blog Title')).toBeDefined()
    expect(screen.getByText('Test Author')).toBeDefined()
    expect(screen.queryByText('http://test.com')).toBeNull()
    expect(screen.queryByText(/likes:/)).toBeNull()
  })

  it('shows url and likes when view button is clicked', async () => {
    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        currentUser={mockCurrentUser}
      />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('http://test.com')).toBeDefined()
    expect(screen.getByText(/likes: 5/)).toBeDefined()
  })

  it('calls the like handler twice if like button is clicked twice', async () => {
    blogService.update.mockResolvedValue({
      ...blog,
      likes: blog.likes + 1,
    })

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

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
  })
})
