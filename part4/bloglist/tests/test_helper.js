const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "My first blog",
        author: "John Doe",
        url: "http://www.johndoe.com",
        likes: 12,
        user: "660a81c36b42b1a36f768bb3",
        id: "660a86615a1568e721dd2337"
    },
    {
        "title": "My first blog",
        "author": "John Doe",
        "url": "http://www.johndoe.com",
        "likes": 12,
        "user": "660a81c36b42b1a36f768bb3",
        "id": "660a86615a1568e721dd5137"
      }
]

const notExistingId = async () => {
    const blog = new Blog ({ 
        title: 'willremovethissoon',
        author: 'willremovethissoon',
        url: 'willremovethissoon',
        likes: 0,
})
    await blog.save()
    await blog.deleteOne()

    return blog.id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, notExistingId, blogsInDb, usersInDb
}