// require("dotenv").config({path: './env'});
import connectDB from './db/db.js';
import app from './app.js'
import dotenv from 'dotenv';


dotenv.config({
    path:'./.env'
});


//for this add in json file dev -r dotenv/config --experimental-json-modules

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{  
        console.log(`server running at port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.error("Database connection failed !!!", error);
})