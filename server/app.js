// Server code is implemented with the help of express library

// utilities
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

// express
const express = require('express')
const app = express()

// Cross-Origin Resource Sharing needed for communication between front-end and back-end
const cors = require('cors')

// Morgan middleware is used for logging requests for debugging purposes
const morgan = require('morgan')

// controllers
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// Communication with MONGODB is done through mongoose library
const mongoose = require('mongoose')

logger.info('Connecting to MONGODB')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MONGODB')
    })
    .catch((error) => {
        logger.error('error connecting to MONGODB', error.message)
    })

// Tinkering with morgan logging. HTTP request body is logged. Sensitive data like passwords are not to be logged.
morgan.token('requestContent', request => {return JSON.stringify(request.body.password ? {...request.body, password: null} : request.body)})

// Taking middleware into use
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestContent :req[header]'))
app.use(middleware.tokenExtractor)

// Routers for api requests
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', middleware.userExtractor, usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/signup', usersRouter)

// Different router for testing
if(process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

// Serving static files
app.use(express.static('build'))
app.use('/users' ,express.static('build'))
app.use('/settings' ,express.static('build'))
app.use('/blogs/:id' ,express.static('build'))
app.use('/users/:id' ,express.static('build'))

// Middleware for handling common errors the correct way
app.use(middleware.errorHandler)

module.exports = app