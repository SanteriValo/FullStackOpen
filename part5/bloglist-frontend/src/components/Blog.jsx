import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 12,
    paddingLeft: 4,
    border: 'solid 1px',
    borderWidth: '1px',
    marginBottom: 5,
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = async () => {
    const updatedBlog = {
      user: blog.user.id || blog.user._id || blog.user,
      likes: likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      const blogToUpdate = {
        ...returnedBlog,
        user: returnedBlog.user.username ? returnedBlog.user : blog.user,
      }
      setLikes(blogToUpdate.likes)
      updateBlog(blogToUpdate)
    } catch (error) {
      console.error(
        'Error liking blog:',
        error.response?.data || error.message
      )
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        deleteBlog(blog.id)
      } catch (error) {
        console.error(
          'Error deleting blog:',
          error.response?.data || error.message
        )
      }
    }
  }

  const isBlogCreator =
    currentUser &&
    blog.user &&
    currentUser.username === (blog.user.username || blog.user)

  return (
    <div style={blogStyle} className="blog" data-testid="blog-item">
      <div className="blog-title-author">
        <span className="blog-title">{blog.title}</span>{' '}
        <span className="blog-author">{blog.author}</span>
        <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
      </div>
      {showDetails && (
        <div className="blog-details">
          <p className="blog-url">{blog.url}</p>
          <p className="blog-likes">
                likes: {likes}
            <button onClick={handleLike}>like</button>
          </p>
          <p className="blog-user">
            {blog.user.username || blog.user || 'Unknown user'}
          </p>
          {isBlogCreator && (
            <button onClick={handleDelete} className="blog-remove">
                    remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        username: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
      }),
    ]).isRequired,
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }),
}

export default Blog
