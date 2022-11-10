
// MongoDB schema and model for user data

const mongoose = require('mongoose')

// blogs, comments and likes are references to other Schemas
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, minLength: 3},
    name: String,
    blogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}],
    passwordHash: String
})

// Tinkering of the schemas toJSON method
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)
