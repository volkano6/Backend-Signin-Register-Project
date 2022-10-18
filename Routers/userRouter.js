const express = require('express')

const postgresClient = require('../config/db.js');

const router = express.Router()

// Create user
router.post('/', async (req, res) => {
    try {
      const text = "INSERT INTO users(email, password, fullname) VALUES($1, crypt($2, gen_salt('bf')), $3) RETURNING *"
      
      const values = [req.body.email, req.body.password, req.body.fullname]
      
      const result = await postgresClient.query(text, values)
      console.log(result)
    } catch (error) {
      console.log("Error occured", error.message)
      return res.status(400).json({message:error.message})
    }
})
  

module.exports = router


