import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Blogform from './components/Blogform'
import Loginform from './components/Loginform'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('error')
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setErrorType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setErrorMessage(`${user.username} logged out`)
    setErrorType('notification')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setErrorType('notification')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      setBlogs(blogs.concat(returnedBlog))
      setBlogFormVisible(false)
    } catch (exception) {
      setErrorMessage('couldn\'t add blog')
      setErrorType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  const updateLikes = async (id) => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: (blog.likes + 1) }

    const returnedBlog = await blogService.update(id, changedBlog)

    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))

  }

  const removeBlog = async (id) => {
    const blog = blogs.find(n => n.id === id)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

  return (
    <div>
      <Notification message={errorMessage} type={errorType}/>

      {user === null ?
        <Loginform
          username={username}
          password={password}
          setPassword={setPassword}
          setUsername={setUsername}
          handleLogin={handleLogin}
        /> :
        <div>
          <p>{user.name} logged in<button onClick={() => logout()}>logout</button></p>
          <div style={hideWhenVisible}>
            <button onClick={() => setBlogFormVisible(true)}>new blog</button>
          </div>
          <div style={showWhenVisible}>
            <Blogform
              addBlog = {addBlog}
            />
          </div>
          <h2>blogs</h2>
          {blogs.sort((a, b) => a.likes - b.likes).reverse().map(blog =>
            <Blog key={blog.id} blog={blog} updateLikes={updateLikes} removeBlog={removeBlog} user={user}/>
          )}
        </div>
      }
    </div>
  )
}

export default App
