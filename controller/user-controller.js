import User from '../model/user-model.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import env from 'dotenv';

env.config();

export const signUp = async (req,res)=>{
    try {
        
        const {email,userName,password}=req.body;
        const hashedPassowrd= await bcrypt.hash(password, 10);
        console.log(hashedPassowrd);
        const user=new User({email,userName,password:hashedPassowrd});
        const data = await user.save();
        console.log("data>>>",data);
        console.log("user inserted succesfully");
        res.status(200).send({message:"success",data:data})
    } catch (error) {
         console.log(error);
         res.status(500).send({message:"Internal Server Error"})
    }
}  

// function generateSecretKey() {
//     const secretKeyValue = crypto.randomBytes(32).toString("hex");
//     return secretKeyValue;
//   }


  function generateJwtToken(payload, secretKey, expiresIn) {
    // Generate the JWT token
    const token = jwt.sign(payload, secretKey, { expiresIn });
  
    return token;
  }

 
  export const login = async (req, res) => {
    console.log(req.body);
    try {
      let user = await User.findOne({ email: req.body.email });
      console.log("get user>>",user);
  
      if (!user) {
        res.status(400).send({ message: 'User does not exist' });
        return;
      }
  
      let isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordCorrect) {
        res.status(400).send({ message: 'Incorrect Password' });
        return;
      }
  
      const secretKey = process.env.JWT_SECRET;
      console.log("secretKey",secretKey);
      const expiresIn = '30s'; // Set your desired expiration time
      const token = generateJwtToken({ userId: user._id }, secretKey, expiresIn);
      console.log("token>>",token);
      
      user.token = token;
      console.log("added token>>",user);
      await user.save();
      res.cookie(String(user._id),token,{
        path:'/',
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly:true,
        sameSite: 'lax'
      })
      res.status(200).send({ message: "Login Successful", token });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  };

//this verify token is only for jwt token not for token comming from cookie
// if you dont want to implement cookie use this jwt authentication only 
//this is using asunc await 
//   export const verifyToken= async(req,res,next)=>{
//     const header=req.headers['authorization'];
//     const token=header.split(" ")[1];
//     console.log(header);
//     console.log("token>>>",token);
//     if(!token){
//         res.status(400).send({message:'token not found'})
//     }
//     const secretKey = process.env.JWT_SECRET;

//     try {
//       const user = await jwt.verify(String(token), secretKey);
//       req.id = user.userId;
//       console.log("userID>>>",user.userId);
//       next();
//     } catch (error) {
//         console.log(error);
//       if (error.name === 'TokenExpiredError') {
//         res.status(401).send({ message: 'Token expired' });
//       } else if (error.name === 'JsonWebTokenError') {
//         res.status(401).send({ message: 'Invalid token' });
//       } else {
//         res.status(500).send({ message: 'Internal server error' });
//       } 
//     }
//   }


//this verify token is only for jwt token not for token comming from cookie
// if you dont want to implement cookie use this jwt authentication only 
//this is using callback function
// export const verifyToken = (req, res, next) => {
//     const header = req.headers['authorization'];
//     const token = header.split(" ")[1];
//     console.log(header);
//     console.log("token>>>", token);
  
//     if (!token) {
//       return res.status(400).send({ message: 'Token not found' });
//     }
  
//     const secretKey = process.env.JWT_SECRET;
  
//     jwt.verify(String(token), secretKey, (error, user) => {
//       if (error) {
//         console.log(error);
//         if (error.name === 'TokenExpiredError') {
//           res.status(401).send({ message: 'Token expired' });
//         } else if (error.name === 'JsonWebTokenError') {
//           res.status(401).send({ message: 'Invalid token' });
//         } else {
//           res.status(500).send({ message: 'Internal server error' });
//         }
//       } else {
//         req.id = user.userId;
//         console.log("userID>>>", user.userId);
//         next();
//       }
//     });
//   };

  
  
  
  
  
  
// this verify jwt token is when toekn comming from cookie
export const verifyToken= async(req,res,next)=>{
    const cookies = req.headers.cookie;
    let token;
    if(cookies){
        token=cookies.split("=")[1];
    }else{
        return res.status(400).send({message:'cookies not found'});
    }

    console.log("cook>>",cookies);
    console.log("token>>",token);

    if(!token){
        return res.status(400).send({message:'token not found'})
    }
    const secretKey = process.env.JWT_SECRET;
    console.log(secretKey);
 
    try {
      const user = await jwt.verify(String(token), secretKey);
      req.id = user.userId;
      console.log("userID>>>",user.userId);
      next(); 
    } catch (error) {
        // console.log(error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).send({ message: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).send({ message: 'Invalid token' });
      } else {
        return res.status(500).send({ message: 'Internal server error' });
      } 
    }
  }

  export const getUser=async(req,res,next)=>{
    const userId=req.id;
    let user;
    try {
       user = await User.findById(userId,"-password");
       console.log(user); 
    } catch (error) {
        return new Error(error)
    } 

    if(!user){
        res.status(404).send({message:'user not found'});
    }
    return res.status(200).send({user})
  }





