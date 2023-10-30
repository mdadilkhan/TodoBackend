import express from 'express';
import {
     signUp,
     login, 
     verifyToken,
     getUser 
    } from '../controller/user-controller.js';


 const router=express.Router();





 router.post('/register',signUp);
 router.post('/login',login)
 router.get('/user',verifyToken,getUser);

 export default router;