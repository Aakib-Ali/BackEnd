import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app=express(); 
app.use(cors({
    //allow host from my origin only which is in .env file
    origin: process.env.CORS_ORIGIN,
    credential: true
}))

//only limited json file data is allowed for my site
app.use(express.json({limit:process.env.DATA_LIMIT}))
//when data is comming from url like %data + data 
app.use(express.urlencoded({extended: true, limit: process.env.DATA_LIMIT}))
//personal data store in static or public
app.use(express.static("public"))
//use cookie parser to use secure browser cookie
app.use(cookieParser())


//import router
import userRouter from './routes/user.routes.js'

//route decleration
app.use('/api/v1/user',userRouter);



export default app;