import ViewHideButton from './ViewHideButton'
import { useState } from 'react'
import { useRef } from 'react'
import serviceBlog from '../services/blogs'

const Blog = ({ blog, removeBlogFromList, increaseLikes, currentUser }) => {

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

  const isBlogCreator = currentUser && currentUser.username === blog.user.username

  return(
    <div style={blogStyle} className='blog'>
      {blog.title}
      <ViewHideButton buttonLabel='view'>
        <div style={infoStyle} id='blog-info' className='blog-info'>
          {blog.url}<br />
          <span>likes {likes} </span><button id="like-btn" onClick={updateLikes}>like</button><br />
          {blog.author}<br />
        </div>
        {isBlogCreator ? 
          <button data-testid="remove-inline-btn" id="remove-inline-btn" style={{display: 'inline'}} onClick={removeBlog}>remove</button> :
          <button data-testid="remove-none-btn" id="remove-none-btn" style={{display: 'none'}} onClick={removeBlog}>remove</button>}
      </ViewHideButton>
    </div>
  )
}

export default Blog