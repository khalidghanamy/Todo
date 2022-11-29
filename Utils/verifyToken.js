import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

        const token = req.headers.authorization;
        console.log(req.headers);
        if (!token) {
            return res.status(401).json({status:false,msg:"Login first"});
        }
        
        jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
            if(err){
                return res.status(401).json({status:false,msg:"Invalid token"});
            }
                req.user = user.user
                return next();
             })
      

    }


export const verifyUser = (req, res, next) => {
    
         verifyToken(req, res, ()=> {
            if(req.user.id == req.params.userId){
                next()
            }
            else{
                
                return res.status(401).json({status:false,msg:"user is not verified"});
            }
    
        })
    }

