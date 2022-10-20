const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decodedToken = jwt.verify(token, 'secretKey')
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