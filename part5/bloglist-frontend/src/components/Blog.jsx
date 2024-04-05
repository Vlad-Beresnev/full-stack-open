import ViewHideButton from './ViewHideButton'
import { useState } from 'react'
import { useRef } from 'react'
import serviceBlog from '../services/blogs'

const Blog = ({blog, removeBlogFromList }) => {

  const [likes, setLikes] = useState(blog.likes)

  const blogFormRef = useRef()

  const infoStyle = {
    display: 'block',
    marginLeft: 'auto',
  }

  const blogStyle = {
    display: 'flex',
    gap: '5px',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const updateLikes = async (event) => {
    event.preventDefault()
    const blogToUpdate = {
      ...blog,
      likes: likes + 1
    }
    const returnedBlog = await serviceBlog.increaseLikes(blogToUpdate)
    setLikes(returnedBlog.likes)
  }


  const removeBlog = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await serviceBlog.remove(blog.id)
      removeBlogFromList(blog.id)
    }
  }


  return(
  <div style={blogStyle}>
    <div >
    {blog.title}
    <ViewHideButton buttonLabel='view'>
    <div style={infoStyle}>
      {blog.url}<br />
      likes {likes} <button onClick={updateLikes}>like</button><br />
      {blog.author}<br />
    </div>
    <button onClick={removeBlog}>remove</button>
    </ViewHideButton>
    </div>
  </div>  
  )
}

export default Blog