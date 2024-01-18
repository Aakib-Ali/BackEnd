import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        //connection string for the mongodb connect
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\nMongo DB connected!!!`);
    } catch (error) {
        console.error("ERROR MongoDB connection FAILED", error);
        process.exit(1);
    }
};

export default connectDB;
