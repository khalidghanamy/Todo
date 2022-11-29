import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../Models/User.js';
import dotenv from 'dotenv';
dotenv.config();


export const signup = async (req, res,next) => {
    try {
        
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            
            return res.status(400).json({ status:false,msg: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        try {
            const savedUser = await newUser.save();
            delete savedUser.password;
            const payload = {
                user: {
                    id: newUser._id
                }
            }
            
           const token= jwt.sign(payload, process.env.JWT_SECRET , { expiresIn: 3600 });
            let user = {
                name: savedUser.name,
                email: savedUser.email,
                id: savedUser._id,
            }
            return res.status(200).json({ status: true,user,msg:"register success",accessToken:token});
        } catch (error) {
            return res.status(400).json({ status:false, msg: 'User name or email are not valid' });
        }
       
      
       
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res,next) => {
      try {
        
          const { email, password } = req.body;
          const user = await User.findOne({ email });
          if (!user) {
              return res.status(400).json({ status:false,msg: 'User name or email are not valid' });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return res.status(400).json({ status:false,msg: 'Invalid credentials' });
          }
          const payload = {
              user: {
                  id: user.id
              }
          }
          
         const token= jwt.sign(payload, process.env.JWT_SECRET , { expiresIn: 3600 });
          let logedUser = {
              name: user.name,
              email: user.email,
              id: user._id,
            }
          return res.status(200).json({ status: true, user: logedUser ,msg:"login success",accessToken:token});
      } catch (error) {
            next(error);
        
      }

}
