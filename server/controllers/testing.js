// Router for testing

// Router object is created
const testingRouter = require('express').Router()

// MONGODB models
const Blog = require('../models/blog')
const User = require('../models/user')

// Route handler for POST requests for resetting the database
testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter