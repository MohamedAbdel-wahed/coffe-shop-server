const jwt= require('jsonwebtoken') 
const { JWT_SECRET }= require('../config/env.json')

module.exports= (context)=> {

    let token;

    if(context.req && context.req.headers.authorization){
        token= context.req.headers.authorization.split('Bearer ')[1]
    }

    if(token){
        jwt.verify(token, JWT_SECRET, (_,decodedToken)=>{
            context.user= decodedToken
        })
    }
    
    return context
}