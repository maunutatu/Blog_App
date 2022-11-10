
// Custom middleware is stored here

// Module for logging
const logger = require('./logger')

// MongoDB model
const User = require('../models/user')

// jwt fot token authentication
const jwt = require('jsonwebtoken')

// Middleware for handling common errors the correct way
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if(error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'JsonWebTokenError') {
        return response.status(401).json({error: 'invalid token'})
    }

    next(error)
}

// Middleware for extracting the token from the HTTP request header. Token is saved to request.token
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }

    next()
}

// Middleware for searching for a correct user with the token fetched by tokenExtractor. User is saved to request.user
const userExtractor = async (request, response, next) => {
    const token = request.token
    if(token) {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        request.user = await User.findById(decodedToken.id)
    }

    next()
}

module.exports = {errorHandler, tokenExtractor, userExtractor}