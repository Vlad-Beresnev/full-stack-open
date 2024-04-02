const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method),
    logger.info('Path:', req.path),
    logger.info('Body:', req.body),
    logger.info('---'),
    next()
}

const unknownEndPoint = (req, res) => {
    res.status(404).send({
        error: 'unknown endpoint'
    })
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return res.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'token missing or invalid'})
    } 

    next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('Authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '')
    }
    next()
}

const userExtractor = async (req, res, next) => {
    const authorization = req.get('Authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.replace('Bearer ', '')
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (decodedToken.id) {
            req.user = await User.findById(decodedToken.id).populate('blogs')
        }    
    }
    next()
}

module.exports = {
    requestLogger,
    unknownEndPoint,
    errorHandler, 
    tokenExtractor,
    userExtractor
}