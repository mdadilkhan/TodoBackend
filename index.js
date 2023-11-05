import  express from 'express';
import Router from './route/route.js'
import Connection from './db/db.js'
import env from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser';

import cookieParser from 'cookie-parser';
// const corsOptions = {
//     origin: 'https://advacnetodoapp.web.app',
//     credentials: true,
//   };
 
env.config() 
const app=express();
   
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));



 
app.use('/v1',Router);
 






const PORT=process.env.PORT || 5000
// //for atlas connections
Connection()


// for local connection
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
}) 