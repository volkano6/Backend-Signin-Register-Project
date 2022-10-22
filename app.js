const express = require('express')
const path = require('path')
const postgresClient = require('./config/db')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const checkJwt = require('./auth')
const cookieParser = require('cookie-parser');
const ejs = require('ejs');



const PORT = 3000

const app = express()

//  MiddleWare
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())


//Routes
app.get('/login', function (req, res) {
  res.cookie('jwt', '',{maxAge:1})
  res.sendFile(path.join(__dirname+'/views/login.html'))
})
app.get('/register', function (req, res) {
  res.cookie('jwt', '',{maxAge:1})
  res.sendFile(path.join(__dirname+'/views/register.html'))
})
app.get('/deneme', async function(req, res) { 
  
})
app.post('/register', async function(req, res) {
  try {
    console.log(req.body)
    //Creating user in DB
    const text = "INSERT INTO users(name, surname, email, password, register_date) VALUES($1, $2, $3, crypt($4, gen_salt('bf')), $5) RETURNING *"
    const  now_date = new Date()
    const values = [req.body.name, req.body.surname, req.body.email, req.body.password, now_date]
    const { rows } = await postgresClient.query(text, values)
    console.log("User is created.")
    
    // Creating TOKEN
    const {name, surname, email} =req.body
    const token =jwt.sign({
      name: name,
      surname:surname,
      email: email,
      exp: Math.floor(Date.now() / 1000) + (60*60*24)
    }, 'secretKey')
    console.log(token)
    console.log("JWT TOKEN is created.")
    res.cookie('jwt', token, {httpOnly: true,maxAge: 60*60*24*1000})
    return res.status(200).redirect("/login")    

  } catch (error) {
    console.log("Error occured", error.message)
    return res.status(400).json({message:error.message})
  }
})
app.post('/login', async function(req, res) {
  try {
    console.log(req.body) 
    const text = "SELECT * FROM users WHERE email =$1 AND password = crypt($2, password)"
    const values = [req.body.email, req.body.password]
    const { rows } = await postgresClient.query(text, values)
    console.log(rows)
    if (!rows.length) {
      console.log('User not found')
      return res.status(404).json({message: 'User not found'})
    }  
    // Creating TOKEN
    const {name, surname, email} =req.body
    const token =jwt.sign({
      name: name,
      surname:surname,
      email: email,
      exp: Math.floor(Date.now() / 1000) + (60*60*24)
    }, 'secretKey')
    res.cookie('jwt', token, {httpOnly: true,maxAge: 60*60*24*1000})
    return res.status(200).redirect('/users')
     
  } catch (error) {
    console.log("Error occured", error.message)
    return res.status(400).json({message: error.message})
  } 
})
app.get('/users', checkJwt , async function (req, res) {
  const text = "SELECT * FROM users"
  const { rows } = await postgresClient.query(text)
  res.render('User_list_page.ejs', {
    rows
  })

})
app.get('/user/update/:paramId', checkJwt , async function (req, res) {
  const text = "SELECT * FROM users WHERE id = $1"
  const value = [req.params.paramId]
  const { rows } = await postgresClient.query(text, value)
  res.render("user_update.ejs", { 
    rows
  })

}) 
app.post('/updating/:paramId', checkJwt , async function(req, res) {
  try {
    const text = "SELECT * FROM users WHERE id = $1 AND password = crypt($2, password)"
    const values = [req.params.paramId, req.body.oldpassword]
    const { rows } = await postgresClient.query(text, values)
    console.log(rows)
    if (!rows.length) {
      console.log('User not found')
      return res.status(404).json({message: 'User not found'})
    } 
    if (req.body.newpassword == '') {
      const text_for_update = "UPDATE users SET name = $1, surname = $2, email = $3 WHERE id = $4 RETURNING*"
      const values_for_update = [req.body.name, req.body.surname, req.body.email, req.params.paramId]
      const { rows } = await postgresClient.query(text_for_update, values_for_update)
      res.redirect("/users")
    } else {
      const text_for_update = "UPDATE users SET name = $1, surname = $2, email = $3, password = crypt($4,password) WHERE id = $5 RETURNING*"
      const values_for_update = [req.body.name, req.body.surname, req.body.email, req.body.newpassword, req.params.paramId]
      const { rows } = await postgresClient.query(text_for_update, values_for_update)
      res.redirect("/users")
    }

  } catch (error) {
    console.log("Error occured", error.message)
    return res.status(400).json({message:error.message})
  }
})
app.get('/user/delete/:paramId', checkJwt , async function(req, res) {
  try {
    const text = "DELETE FROM users WHERE id = $1 RETURNING *"
    const value = [req.params.paramId]
    const { rows } = await postgresClient.query(text, value)
    console.log(rows)
    res.redirect("/users")
    if (!rows.length) {
      console.log('User not found')
      return res.status(404).json({message: 'User not found'})
    } 
  } catch (error) {
    console.log("Error occured", error.message)
    return res.status(400).json({message:error.message})
  }
})

app.get('/logout', function(req,res) {
  res.cookie('jwt', '',{maxAge:1})
  res.redirect('/login')
}) 

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`)
})