const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')   
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')


mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB', error.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)


module.exports = app