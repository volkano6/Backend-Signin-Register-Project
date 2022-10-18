const express = require('express');
const app = express()
const path = require('path');
const postgresClient = require('./config/db.js');

const PORT = 3000

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


app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`)
})