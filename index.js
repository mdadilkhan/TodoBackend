import  express from 'express';
import Router from './routes/route.js'
import Connection from './db/db.js'
import env from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import cookieParser from 'cookie-parser';


env.config()
const app=express();

app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));




app.use('/v1',Router);
 






const PORT=process.env.PORT
//for atlas connections
Connection()


// for local connection
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
}) 