const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Backend is built on top NodeJS. Web server is created with CommonJS http module

const server = http.createServer(app)

// Server waits for queries
server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})