const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const tokenExtractor = require('../utils/middleware').tokenExtractor

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1})
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body

    if (!username || !name || !password) {
        return res.status(400).json({ error: 'username, name, and password must be provided' })
    }

    if (password.length < 3) {
        return res.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    if (username.length < 3) {
        return res.status(400).json({ error: 'username must be at least 3 characters long'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User ({
        username, 
        name,
        passwordHash,
        blogs: []
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

usersRouter.delete('/:id', async (req, res) => {


    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    } else {
        const user = await User.findById(decodedToken.id)

        if (!user) {
            return res.status(404).json({ error: 'user not found' })
        }

        if (user._id.toString() !== req.params.id) {
            return res.status(403).json({ error: 'user not authorized to delete this user' })
        }
    
        await User.findByIdAndDelete(req.params.id)
        res.status(204).end()
    }
})

module.exports = usersRouter