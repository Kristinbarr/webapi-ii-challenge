const express = require('express')

const dbRouter = require('./posts-router')

const server = express()

server.use(express.json())

server.use('/api/posts', dbRouter)

// GET - localhost:3030/ test server connection in browser
server.get('/', (req, res) => {
  res.send(`<h2>Hello World!</h2>`)
})

const port = 3030
server.listen(port, () => {
  console.log(`\n*** Server running on port ${port} ***\n`)
})
