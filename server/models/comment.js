
// MongoDB schema and model for comment data

const mongoose = require('mongoose')

// user and blog are references to other Schemas
const commentSchema = new mongoose.Schema({
  text: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  blog: {type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true}
})

// Tinkering of the toJSON method
commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Comment', commentSchema)