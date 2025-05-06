import { useState } from 'react'

const BlogForm = ( { createBlog } ) => {
  const [title, setTitle] = useState( '' )
  const [author, setAuthor] = useState( '' )
  const [url, setUrl] = useState( '' )

  const addBlog = ( event ) => {
    event.preventDefault()
    createBlog( {
      title,
      author,
      url
    } )
    setTitle( '' )
    setAuthor( '' )
    setUrl( '' )
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <label>
            title:
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            aria-label="title"
            data-testid="title-input"
          />
        </label>
      </div>
      <div>
        <label>
            author:
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            aria-label="author"
            data-testid="author-input"
          />
        </label>
      </div>
      <div>
        <label>
            url:
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            aria-label="url"
            data-testid="url-input"
          />
        </label>
      </div>
      <button type="submit" data-testid="create-blog-button">create</button>
    </form>
  )
}

export default BlogForm