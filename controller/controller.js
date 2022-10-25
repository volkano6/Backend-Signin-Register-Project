const logger = require('../config/logger');
const postgresClient = require('../config/db')
const jwt = require('../node_modules/jsonwebtoken')

exports.login_get = function (req, res) {
    res.cookie('jwt', '',{maxAge:1})
    res.render('login.ejs')
  }
exports.register_get = function (req, res) {
    res.cookie('jwt', '',{maxAge:1})
    res.render('register.ejs')
  }
exports.register_post = async function(req, res) {
    try {
      //Creating user in DB
      const text = "INSERT INTO users(name, surname, email, password, register_date) VALUES($1, $2, $3, crypt($4, gen_salt('bf')), $5) RETURNING *"
      const  now_date = new Date()
      const values = [req.body.name, req.body.surname, req.body.email, req.body.password, now_date]
      const { rows } = await postgresClient.query(text, values)
      console.log("User is created.")

      logger.register_logger.log('info', `${req.body.email} is registered!`) 
      
      // Creating TOKEN 
      const {name, surname, email} =req.body
      const token =jwt.sign({
        name: name,
        surname:surname,
        email: email,
        exp: Math.floor(Date.now() / 1000) + (60*60*24)
      }, 'secretKey')
      console.log("JWT TOKEN is created.")
      
      res.cookie('jwt', token, {httpOnly: true,maxAge: 60*60*24*1000})
      
      return res.status(200).redirect("/login")    
  
    } catch (error) {
      logger.register_logger.log('error', `${req.body.email} have error that occured ${error.message}`) 
      console.log("Error occured", error.message)
      return res.status(400).json({message:error.message})
    }
  }
exports.login_post = async function(req, res) {
  try {
    const text = "SELECT * FROM users WHERE email =$1 AND password = crypt($2, password)"
    const values = [req.body.email, req.body.password]
    const { rows } = await postgresClient.query(text, values)
    if (!rows.length) {
      console.log('User not found')
      logger.login_logger.log('error', `email: ${req.body.email}, password : ${req.body.password} USER NOT FOUND!`) 
      return res.status(404).json({message: 'User not found'})
    }else {
      // Creating TOKEN
      const {name, surname, email} =req.body
      const token =jwt.sign({
        name: name,
        surname:surname,
        email: email,
        exp: Math.floor(Date.now() / 1000) + (60*60*24)
      }, 'secretKey')
      res.cookie('jwt', token, {httpOnly: true,maxAge: 60*60*24*1000})
      logger.login_logger.log('info', `${req.body.email} logged in!`) 
      return res.status(200).redirect('/users')
    }
  } catch (error) {
    console.log("Error occured", error.message)
    logger.login_logger.log('error', `${req.body.email} have a error that occured ${error.message}`) 
    return res.status(400).json({message: error.message})
  } 
}
exports.users_get = async function (req, res) {
  const text = "SELECT * FROM users"
  const { rows } = await postgresClient.query(text)
  res.render('User_list_page.ejs', {
    rows
  })

}
exports.update_get = async function (req, res) {
  const text = "SELECT * FROM users WHERE id = $1"
  const value = [req.params.paramId]
  const { rows } = await postgresClient.query(text, value)
  res.render("user_update.ejs", { 
    rows
  })

}
exports.update_post = async function(req, res) {
  try {
    const text = "SELECT * FROM users WHERE id = $1 AND password = crypt($2, password)"
    const values = [req.params.paramId, req.body.oldpassword]
    const {rows} = await postgresClient.query(text, values)
    if (!rows.length) {
      console.log('User not found')
      logger.update_logger.log('error', `${rows[0].email} not found!`) 
      return res.status(404).json({message: 'User not found'})
    } 
    if (req.body.newpassword == '') {
      const text_for_update = "UPDATE users SET name = $1, surname = $2, email = $3 WHERE id = $4 RETURNING*"
      const values_for_update = [req.body.name, req.body.surname, req.body.email, req.params.paramId]
      await postgresClient.query(text_for_update, values_for_update)
      logger.update_logger.log('info', `${rows[0].name},${rows[0].surname},${rows[0].email} are changed with ${req.body.name},${req.body.surname},${req.body.email}`) 
      res.redirect("/users")
    } else {
      const text_for_update = "UPDATE users SET name = $1, surname = $2, email = $3, password = crypt($4,password) WHERE id = $5 RETURNING*"
      const values_for_update = [req.body.name, req.body.surname, req.body.email, req.body.newpassword, req.params.paramId]
      await postgresClient.query(text_for_update, values_for_update)
      logger.update_logger.log('info', `${rows[0].name},${rows[0].surname},${rows[0].email} are changed with ${req.body.name},${req.body.surname},${req.body.email}`) 
      res.redirect("/users")
    }

  } catch (error) {
    console.log("Error occured", error.message)
    logger.update_logger.log('error', `id:${req.params.paramId} have a error that occured ${error.message}`) 
    return res.status(400).json({message:error.message}) 
  }
}
exports.delete_get = async function(req, res) {
  try {
    const text = "DELETE FROM users WHERE id = $1 RETURNING *"
    const value = [req.params.paramId]
    const { rows } = await postgresClient.query(text, value)
    if (!rows.length) {
      console.log('User not found')
      logger.delete_logger.log('error', `${rows[0].email} is not found.`) 
      return res.status(404).json({message: 'User not found'})
    }
    logger.delete_logger.log('info', `${rows[0].email} is deleted.`) 
    res.redirect("/users")
  } catch (error) {
    console.log("Error occured", error.message)
    logger.delete_logger.log('error', `${rows[0].email} have a error that occured ${error.message}`) 
    return res.status(400).json({message:error.message})
  }
}
exports.logout_get = function(req,res) {
  res.cookie('jwt', '',{maxAge:1})
  res.redirect('/login')
}