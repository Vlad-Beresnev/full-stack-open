require('dotenv').config()
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor


blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
    res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'Unauthorized' })
    }

    const blog = new Blog ({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
    
    const user = req.user
    if (!user) {
        return res.status(401).json({ error: 'token invalid' })
    } else {
        const blog = await Blog.findById(req.params.id)

        if (!blog) {
            return res.status(404).json({ error: 'blog not found' })
        }

        if (blog.user.toString() !== user._id.toString()) {
            return res.status(403).json({ error: 'user not authorized to delete this blog' })
        } else {
            await Blog.findByIdAndDelete(req.params.id)
            return res.status(204).end()
        }
    }
})

blogsRouter.put('/:id', async (req, res) => {
    const user = req.user
    const body = req.body

    if (!user) {
        return res.status(401).json({ error: 'token invalid' })
    } else {

        const blog = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes
        }
        
        const updatedBlog = await Blog.findById(req.params.id)
        
        if (!updatedBlog) {
            return res.status(404).json({ error: 'blog not found' })
        }

        if (updatedBlog.user.toString() !== user._id.toString()) {
            return res.status(403).json({ error: 'user not authorized to update this blog'})
        } else {
            await Blog.findByIdAndUpdate(req.params.id, blog, { new: true})
            return res.status(200).json(updatedBlog)
        }
    }
})


module.exports = blogsRouter