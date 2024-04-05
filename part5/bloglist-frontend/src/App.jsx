import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './app.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [style, setStyle] = useState('')

  const blogFormRef = useRef()

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

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
  }

  // const addBlog = async (event) => {
  //   event.preventDefault()
  //   const blogObject = {
  //     title: title,
  //     author: author,
  //     url: url,
  //     likes: likes,
  //   }

  //   try {
  //     const returnedBlog = await blogService.create(blogObject)
  //     setBlogs(blogs.concat(returnedBlog))
  //     setTitle('')
  //     setAuthor('')
  //     setUrl('')
  //     setLikes(0)
  //     setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
  //     setStyle('message')
  //     setTimeout(() => {
  //       setMessage(null)
  //     }, 5000)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleLikesChange = (event) => {
    setLikes(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (expeption) {
      console.log('Wrong credentials')
      setMessage('Wrong credentials')
      setStyle('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          username
          <input 
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input 
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
  )

  // const blogForm = () => (
  //   <form onSubmit={addBlog}>
  //     title:
  //     <input value={title} onChange={handleTitleChange} />
  //     <br />
  //     author:
  //     <input value={author} onChange={handleAuthorChange} />
  //     <br />
  //     url:
  //     <input value={url} onChange={handleUrlChange} />
  //     <br />
  //     likes:
  //     <input value={likes} onChange={handleLikesChange} />
  //     <br />
  //     <button type='submit'>create blog</button>
  //   </form>
  // )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const Notification = ({ message, style }) => {
    if (message === null) {
      return null
    }

    if (style === 'error') {
      return (
        <div className='error'>
          {message}
        </div>
      )
    } else {
      return (
        <div className='message'>
          {message}
        </div>
      )
    }
  }

  const removeBlogFromList = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} style={style} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} style={style} />
      <p>{user.name} logged in <button onClick={() => { window.localStorage.removeItem('loggedBlogappUser'), setUser(null)}}>logout</button></p>
      {blogForm()}
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} removeBlogFromList={removeBlogFromList} />
      ))}
    </div>
  )


    
    
    // <div>
    //   {user === null ? (
    //     loginForm() 
    //     ) : (
          
    //   )}

    // </div>
  
}

export default App