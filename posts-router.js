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
      res.status(500).json({ message: 'Error retrieving posts' })
    })
})

module.exports = router
