const express = require('express')

const db = require('./data/db')

const router = express.Router()

// GET - returns all posts in an array
router.get('/', (req, res) => {
  db.find(req.query)
    .then((posts) => {
      res.status(200).json(posts)
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved' })
    })
})

// GET - return post by id
router.get('/:id', (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
      if (post) { // if post from id is found, return 200 and post
        res.status(200).json(post)
      } else { // if post from id NOT found, return 404 and message
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' })
      }
    })
    .catch((error) => { // if db cannot find post, return 500 and error msg
      res.status(500).json({ message: 'Error retrieving post' })
    })
})

module.exports = router
