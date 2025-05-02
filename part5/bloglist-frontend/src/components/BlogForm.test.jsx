import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  it('calls the event handler with correct details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByLabelText(/title/i)
    const authorInput = screen.getByLabelText(/author/i)
    const urlInput = screen.getByLabelText(/url/i)
    const createButton = screen.getByRole('button', { name: /create/i })

    await user.type(titleInput, 'Testing form title')
    await user.type(authorInput, 'Form Author')
    await user.type(urlInput, 'http://formtest.com')
    await user.click(createButton)

    expect(createBlog).toHaveBeenCalledOnce()
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testing form title',
      author: 'Form Author',
      url: 'http://formtest.com',
    })
  })
})
