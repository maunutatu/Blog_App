
// Router for blogs


require('express-async-errors')

// Router object is created
const blogsRouter = require('express').Router()

// jwt for token authentication
const jwt = require('jsonwebtoken')

// MONGODB models
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')

// Route handler for GET requests
blogsRouter.get('/', async (request, response) => {
    // Related User and Comment data is added to each Blog
    const blogs = await Blog.find({}).populate('user').populate('comments')
    response.json(blogs)
})

// Route handler for POST requests
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    // Token is fetched from the request due to tokenExtractor middleware
    const token = request.token

    // jwt decodes token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    // Request is denied without a correct token
    if(!token || !decodedToken.id) {
        return response.status(401).json({error: 'token missing or invalid'})
    }

    // User can be fetched from the request due to userExtractor middleware
    const user = request.user
    const userAdded = {...body, user: user._id}

    // Blog is created and saved
    const blog = await new Blog(userAdded)
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    // Response to the front-end verifying a successful query
    response.status(201).json(savedBlog)
})

// Route handler for DELETE requests
blogsRouter.delete('/:id', async (request, response) => {
    // Blog is searched with the id parameter
    const blog = await Blog.findById(request.params.id)

    // User can be fetched from the request due to userExtractor middleware
    const user = request.user

    // Checking if a valid user is logged in. User id must match the blogs user id.
    if(user) {
        if(user._id.toString() === blog.user.toString()) {
            // Blog posts each comment must be removed from all collections: blogs, users, and comments.
            async function removeComments (value) {
                const comment = await Comment.findById(value.toString())
                const user = await User.findById(comment.user.toString())
                user.comments = user.comments.filter(x => x.toString() !== value.toString())
                await user.save()
                await Comment.findByIdAndRemove(value.toString())
            }
            blog.comments.forEach(removeComments)

            // Blog is deleted
            await Blog.findByIdAndRemove(request.params.id)

            // Users blog information gets updated
            await User.findByIdAndUpdate(user._id, {...user, blogs: user.blogs.filter(x => x.toString() !== request.params.id)}, {new: true, runValidators: true, context: 'query'})

            // Response to the front-end verifying a successful query
            response.status(204).end()
        } else {
            // Response to the front-end of an unsuccessful query
            response.status(401).end()
        }
    } else {
        // Response to the front-end of an unsuccessful query
        response.status(401).end()
    }
})

// Route handler for PUT requests
blogsRouter.put('/:id',  async (request, response) => {
    const body = request.body

    // User can be fetched from the request due to userExtractor middleware
    const user = request.user

    // Blog is searched with the id parameter
    const blog = await Blog.findById(request.params.id)

    // Checking if a valid user is logged in. User id must match the blogs user id.
    if(user) {
        if(user._id.toString() === blog.user.toString()) {
            // All necessary data is fetched from the HTTP request
            const blogpost = {
                title: body.title,
                author: body.author,
                url: body.url,
                likes: body.likes,
                comments: body.comments
            }

            // Blog is updated and saved
            await Blog.findByIdAndUpdate(request.params.id, blogpost, {new: true, runValidators: true, context: 'query'})
            const updatedBlog = await Blog.findById(request.params.id)

            // Response to the front-end of a successful query and the updated blog
            response.status(200).json(updatedBlog)
        } else {
            // Response to the front-end of an unsuccessful query
            response.status(401).end()
        }
    } else {
        // Response to the front-end of an unsuccessful query
        response.status(401).end()
    }
})

// Route handler for PUT requests regarding blog likes
blogsRouter.put('/:id/like',  async (request, response) => {
    // User can be fetched from the request due to userExtractor middleware
    const user = request.user

    // Blog is searched with the id parameter
    const blog = await Blog.findById(request.params.id)

    // Function for updating users likes
    async function updateUserLikes () {
        if(user.likes) {
            if(!user.likes.includes(blog._id)) {
                user.likes = user.likes.concat(blog._id)
            } else {
                user.likes = user.likes.filter(x => x.toString() !== blog._id.toString())
            }
        } else {
            user.likes = [blog._id]
        }
        await user.save()
    }

    // A valid user must be logged in. If a user has already liked the blog post, the like gets removed. If not, a like is added from that user.
    if(user && (blog.likes && blog.likes.includes(user._id))) {
        // Like is removed from the post
        blog.likes = blog.likes.filter(x => x.toString() !== user._id.toString())
        await blog.save()

        // Users likes are updated
        await updateUserLikes()

        const updatedBlog = await Blog.findById(request.params.id)

        // Response to the front-end of a successful query and the updated blog
        response.status(200).json(updatedBlog)
    } else if (user) {
        if(blog.likes) {
            blog.likes = blog.likes.concat(user._id)
        } else {
            blog.likes = [user._id]
        }
        await blog.save()

        await updateUserLikes()

        const updatedBlog = await Blog.findById(request.params.id)

        // Response to the the front-end of a successful query and the updated blog
        response.status(200).json(updatedBlog)
    } else {
        // Response to the front-end of an unsuccessful query
        response.status(401).end()
    }
})

// Route handler for POST requests regarding comments
blogsRouter.post('/:id/comments', async(request, response) => {
    const body = request.body

    // User can be fetched from the request due to userExtractor middleware
    const user = request.user

    // Blog is searched with the id parameter
    const blog = await Blog.findById(request.params.id)

    // Comment data from the HTTP request body is enriched with data about the user and the blog
    const commentWithUser = {...body, user: user._id}
    const commentWithBlog = {...commentWithUser, blog: blog._id}

    // Comment is created and saved
    const comment = await new Comment(commentWithBlog)
    const savedComment = await comment.save()

    // Blog posts comments are refreshed
    if(blog.comments) {
        blog.comments = blog.comments.concat(savedComment._id)
    } else {
        blog.comments = [savedComment._id]
    }
    await blog.save()

    // Users comments are refreshed
    if(user.comments) {
        user.comments = user.comments.concat(savedComment._id)
    } else {
        user.comments = [savedComment._id]
    }
    await user.save()

    const updatedBlog = await Blog.findById(request.params.id)

    // Response to the front-end of a successful query and the updated blog
    response.status(200).json(updatedBlog)
})

// Route handler for DELETE requests regarding comments
blogsRouter.delete('/:blogid/comments/:commentid', async(request, response) => {
    // User can be fetched from the request due to userExtractor middleware
    const user = request.user

    // Comment is searched with the id parameter
    const comment = await Comment.findById(request.params.commentid)

    // A valid user must be logged in and the user id must match the user if of the comment.
    if(user && user._id.toString() === comment.user.toString()) {
        // Comment is removed from the blog
        const blog = await Blog.findById(comment.blog.toString())
        blog.comments = blog.comments.filter(x => x.toString() !== comment._id.toString())
        await blog.save()

        // Comment is removed from the user
        user.comments = user.comments.filter(x => x.toString() !== comment._id.toString())
        await user.save()

        // Comment is removed
        await Comment.findByIdAndRemove(comment._id.toString())

        // Response to the front-end verifying successful query
        response.status(204).end()
    } else {
        // Response to the front-end of an unsuccessful query
        response.status(401).end()
    }
})

module.exports = blogsRouter


