import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch (exception) {
      alert('Wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  if (!user) {
    return (
        <div>
          <h2>Log in to application</h2>
          <LoginForm handleLogin={handleLogin} />
        </div>
    )
  }

  return (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
        )}
      </div>
  )
}

export default App
