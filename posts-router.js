// import express
const express = require('express')

// import database
const db = require('./data/db')

// spin up a router instance
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
  db.findPostComments(req.params.id)
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

// POST - create a comment for an existing post with id
router.post('/:id/comments', (req, res) => {
  // insertComment(): accepts comment object, adds it to database, returns object with the id of comment. The object ex: { id: 123 }.
  // This method will throw an error if the post_id field in the comment object does not match a valid post id in the database.

  if (!req.body.text) {
    // checks for a request body
    res
      .status(400) // BAD REQUEST
      .json({ errorMessage: 'Please provide text for the comment.' })
  } else if (req.body.post_id !== Number(req.params.id)) {
    // checks if postid in body matches param id
    res
      .status(400) // BAD REQUEST
      .json({ message: 'The specified post ID does not match the request ID.' })
  } else if (!db.findById(req.params.id)) {
    // checks if param id returns data
    res
      .status(404) // NOT FOUND
      .json({ message: 'The post with the specified ID does not exist.' })
  } else {
    db.insertComment(req.body) // saves comment to db, returns the new comment
      .then((newComment) => {
        res.status(201).json(newComment) // 201 CREATED
      })
      .catch((error) => {
        res.status(500).json({
          // SERVER ERROR
          error: 'There was an error while saving the post to the database'
        })
      })
  }
})

// PUT - update an existing post by id and body
router.put('/:id', (req, res) => {
  // deconstructing the req.body and a variable just for title and contents
  const { title, contents } = req.body
  const changes = { title, contents }

  // if title or contents don't exist, enter this conditional
  if (!title || !contents) {
    res
    .status(400) // BAD REQUEST
    .json({ errorMessage: 'Please provide title and contents for the post.' })
  }

  // update(): accepts 2 arguments, id and object with changes. returns count of updated records. count of 1 means it was successful.
  db.update(req.params.id, changes)
    .then((count) => {
      if (count == 1) {
        res.status(200).json(changes)
      } else {
        res
          .status(404) // NOT FOUND
          .json({ message: 'The post with the specific ID does not exist.' })
      }
    })
    .catch((error) => {
      res
        .status(500) // SERVER ERROR
        .json({ error: 'The post information could not be modified.' })
    })
})

module.exports = router
