// require("dotenv").config({path: './env'});
import connectDB from './db/db.js';


import dotenv from 'dotenv';
dotenv.config();


//for this add in json file dev -r dotenv/config --experimental-json-modules

connectDB();