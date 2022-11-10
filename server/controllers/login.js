
// Router for login


require('express-async-errors')

// Router object is created
const loginRouter = require('express').Router()

// jwt for token authentication
const jwt = require('jsonwebtoken')

// bcrypt for password hashing
const bcrypt = require('bcrypt')

// MONGODB model
const User = require('../models/user')

// Route handler for POST requests
loginRouter.post('/', async (request, response) => {
    const {username, password} = request.body

    // User is searched with the username
    const user = await User.findOne({username})

    // If a user is found, the password is checked to be correct
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    // If the user is not found or password is not correct, response is sent to the front-end of an unsuccessful query
    if(!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    // User is assigned a token for authentication
    const userForToken = {
        username: user.username,
        id: user._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60*60})

    // Response to the front-end verifying a successful query
    response.status(200).send({token, username: user.username, name: user.name, id: user.id})
})

module.exports = loginRouter