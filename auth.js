const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        console.log("verify token.")
        const token = req.cookies.jwt
        const decodedToken = jwt.verify(token, 'secretKey')
        console.log("token is correct.")
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({
                message:'Token Süren Dolmuştur.',
                status: -1
            })
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({
                message:'Geçersiz bir token veya imza. ',
                status: -1
            })
        } else {
            return res.status(401).send({
                message:'Yetkisiz erişim.',
                status: -1
            })  
        }  
    }
}