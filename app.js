const express = require('express');
const path = require('path');
const postgresClient = require('./config/db');



const PORT = 3000


const app = express()

//  MiddleWare
app.use(express.static('public'))
app.use(express.json())


//Routes
app.get('/login', function (req, res) {
   res.sendFile(path.join(__dirname+'/views/login.html'))
})

app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname+'/views/register.html'))
})

app.post('/register', async function(req, res) {
  try {
    const text = "INSERT INTO users(email, password, fullname) VALUES($1, crypt($2, gen_salt('bf')), $3) RETURNING *"
    const values = [req.body.email, req.body.password, req.body.fullname]
    const { rows } = await postgresClient.query(text, values)
    return res.status(201).json({createdUser: rows[0]})

  } catch (error) {
    console.log("Error occured", error.message)
    return res.status(400).json({message:error.message})
  }
})

app.post('/login', async function(req, res) {
  try {
    const text = "SELECT * FROM users WHERE email =$1 AND password = crypt($2, password)"

    const values = [req.body.email, req.body.password]

    const { rows } = await postgresClient.query(text, values)
    if (!rows.length) {
      return res.status(404).json({message: 'User not found'})
    }
    return res.status(200).json({message:'Authentication successful.'})

  } catch (error) {
    console.log("Error occured", error.message)
    return res.status(400).json({message: error.message})

  }
})


app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`)
})