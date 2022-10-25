const express = require('express')
const path = require('path')
const postgresClient = require('./config/db')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const checkJwt = require('./config/auth')
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const logger = require('./config/logger');
const cont =require('./controller/controller')

const PORT = 3000

const app = express()

//  MiddleWare
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())


//  Routes
app.get('/login', cont.login_get)
app.post('/login', cont.login_post)

app.get('/register', cont.register_get)
app.post('/register', cont.register_post)

app.get('/users', checkJwt , cont.users_get )
app.get('/user/update/:paramId', checkJwt , cont.update_get) 
app.post('/updating/:paramId', checkJwt , cont.update_post)
app.get('/user/delete/:paramId', checkJwt , cont.delete_get)

app.get('/logout', cont.delete_get) 

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`)
})