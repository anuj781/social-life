import jwt from 'jsonwebtoken'
const SECRET = 'hellohi'

const checkToken =(req,res,next)=>{
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).json({msg:"unauthorized"})
    }
    try{
     let decoded = jwt.verify(token, SECRET)
     req.user = decoded
     next()
    }
    catch(error){
    res.status(500).json({msg:error.message})
    }
}

export default checkToken 