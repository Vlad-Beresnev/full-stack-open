import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const [likes, setLikes] = useState(0)

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title, 
            author: author, 
            url: url,
            likes: likes,
        })

        setTitle('')
        setAuthor('')
        setUrl('')
        setLikes('')

    }

    return (
        <div>
            <h2>Create new blog</h2>
            <form onSubmit={addBlog}>
                title 
                <input 
                    type="text"
                    name="Title"
                    value={title}
                    onChange={ event  => setTitle(event.target.value)}
                />
                <br />
                author
                <input 
                    type="text"
                    name="Author"
                    value={author}
                    onChange={event => setAuthor(event.target.value)}
                />
                <br />
                url
                <input 
                    type="text"
                    name="Url"
                    value={url}
                    onChange={event => setUrl(event.target.value)}
                />
                <br />
                likes
                <input 
                    type="number"
                    name="Likes"
                    value={likes}
                    onChange={event => setLikes(event.target.value)}
                />
                <br />
                <button type="submit">create blog</button>
            </form>
        </div>
    )
}

export default BlogForm