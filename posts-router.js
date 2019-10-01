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
      if (post) {
        // if post from id is found, return 200 and post
        res.status(200).json(post)
      } else {
        // if post from id NOT found, return 404 and message
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' })
      }
    })
    .catch((error) => {
      // if db cannot find post, return 500 and error msg
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' })
    })
})

// GET - return comments from a post's id
router.get('/:id/comments', (req, res) => {
  // findCommentById() - accepts id, returns comment associated with id
  db.findCommentById(req.params.id)
    .then((comments) => {
      if (comments) {
        res.status(200).json(comments)
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' })
    })
})

// POST - create a new post
router.post('/', (req, res) => {
  // insert(): accepts a post object and adds it to the database. returns object with id of inserted post. Object example: { id: 123 }
  if (!req.body.title || !req.body.contents) {
    return res
      .status(400)
      .json({ errorMessage: 'Please provide title and contents for the post.' })
  }
  db.insert(req.body) // give the fn the object post
    .then((post) => {
      res.status(201).json(post)
    })
    .catch((error) => {
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      })
    })
})

module.exports = router
