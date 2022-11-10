
// Router for users


require('express-async-errors')

// Router object is created
const usersRouter = require('express').Router()

// bcrypt for password hashing
const bcrypt = require('bcrypt')

// MONGODB models
const User = require('../models/user')
const Blog = require('../models/blog')
const Comment = require('../models/comment')

// Route handler for GET requests
usersRouter.get('/', async (request, response) => {
    // Related Blog data is added to each User
    const users = await User.find({}).populate('blogs')

    response.json(users)
})

// Route handler for POST requests
usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    // If there is no password or the length is under three characters, a response indicating error is sent back to the front-end
    if(!password || (password.length < 3)) {
        return response.status(400).json({error: 'Valid password must be given'})
    }

    // If there is an already existing user with the same username, a response indicating error is sent back to the front-end
    const existingUser = await User.findOne({username})
    if (existingUser) {
        return response.status(400).json({error: 'Username must be unique'})
    }

    // Password is hashed and the passwordHash is saved to the database. The password gets hashed 2^10 times.
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // New User is created and saved
    const user = new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await user.save()

    // Response to the front-end verifying a successful query and the saved user
    response.status(201).json(savedUser)
})

// Route handler for PUT requests
usersRouter.put('/:id', async (request, response) => {
    const body = request.body

    // User can be fetched from the request due to userExtractor middleware
    const userLoggedIn = request.user

    // A valid user must be logged in and the user id must match the id of the to be updated user
    if(userLoggedIn && userLoggedIn._id.toString() === body.id.toString()) {
        // If the body contains a password, it's to be updated
        if(body.password) {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(body.password, saltRounds)

            const user = {
                name: body.name,
                username: body.username,
                password: passwordHash
            }

            // User is updated
            await User.findByIdAndUpdate(request.params.id, user, {new: true, runValidators: true, context: 'query'})
            const updatedUser = await User.findById(request.params.id)

            // Response to the front-end verifying a successful query and the updated user
            response.status(200).json(updatedUser)
        } else {

            // Password was not changed so the update does not handle password data

            const user = {
                name: body.name,
                username: body.username,
            }

            // User is updated
            await User.findByIdAndUpdate(request.params.id, user, {new: true, runValidators: true, context: 'query'})
            const updatedUser = await User.findById(request.params.id)

            // Response to the front-end verifying a successful query and the updated user
            response.status(200).json(updatedUser)        }
    } else {
        // Response to the front-end if an unsuccessful query
        response.status(401).end()
    }
})


// Route handler for DELETE requests
usersRouter.delete('/:id', async (request, response) => {

    // User can be fetched from the request due to userExtractor middleware
    const userLoggedIn = request.user

    // A valid user must be logged in and the user id must match the id of the to be deleted user
    if(userLoggedIn && userLoggedIn._id.toString() === request.params.id) {
        // Comments must be removed from all collections: blogs, comments and users.
        async function removeComment(value) {
            const comment = await Comment.findById(value.toString())
            const blogToBeRemovedFrom = await Blog.findById(comment.blog.toString())
            blogToBeRemovedFrom.comments = blogToBeRemovedFrom.comments.filter(x => x.toString() !== value.toString())
            await blogToBeRemovedFrom.save()
            await Comment.findByIdAndRemove(value.toString())
        }
        await userLoggedIn.comments.forEach(removeComment)

        // Likes must be removed from blogs
        async function removeLike(value) {
            const blogToBeRemovedFrom = await Blog.findById(value.toString())
            blogToBeRemovedFrom.likes = blogToBeRemovedFrom.likes.filter(x => x.toString() !== userLoggedIn._id.toString())
            await blogToBeRemovedFrom.save()
        }
        await userLoggedIn.likes.forEach(removeLike)

        // Blogs must be removed
        async function removeBlog(value) {
            await Blog.findByIdAndRemove(value.toString())
        }
        await userLoggedIn.blogs.forEach(removeBlog)

        // User is removed
        await User.findByIdAndRemove(request.params.id)

        // Response to the front-end verifying a successful query
        response.status(204).end()
    } else {
        // Response to the front-end of an unsuccessful query
        response.status(401).end()
    }
})

module.exports = usersRouter