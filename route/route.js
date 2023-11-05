import express from 'express';
import {
     signUp,
     login, 
     verifyToken,
     getUser,
     refreshToken
    } from '../controller/user-controller.js';


 const router=express.Router();





 router.post('/register',signUp);
 router.post('/login',login)
 router.get('/user',verifyToken,getUser);
 router.get('/refreshToken',refreshToken,verifyToken,getUser);

 export default router;