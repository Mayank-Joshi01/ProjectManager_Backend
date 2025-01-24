const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const user_middleware = async (req,res,next)=>{

    const token = req.header("token")
    console.log(token)

    if(!token){
        return res.status(401).send({error : "Please use a valid token"})
    }
    try {
        const data =  await jwt.verify(token,JWT_SECRET);

    req.user = data;
    console.log(req.user)

    next();
    } catch (error) {
      res.status(401).send({error : "Please use a valid token"})
    }
    
}

module.exports = user_middleware