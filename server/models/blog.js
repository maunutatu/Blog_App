
// MongoDB schema and model for blog data

const mongoose = require('mongoose')

// user, likes and comments are references to other Schemas
const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    url: {type: String, required: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
})

// Tinkering of the toJSON method
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)