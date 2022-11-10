require('dotenv').config()

// Port is fetched from environmental data
const PORT = process.env.PORT

// Different MONGODB address when testing
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

module.exports = {PORT, MONGODB_URI}