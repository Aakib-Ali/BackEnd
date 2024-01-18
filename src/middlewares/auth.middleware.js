import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"


export const verifyJWT = asynchandler( async (req,res,next)=>{

    //if cookie don't have accessToken then header ke pass jaroor hi hoga like Authorization: Bearer <Token> that's why we are replace with empty string
    try {
        const token =req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "") 
        if(!token){
            throw new ApiError(400, "Unauthorize requrest")
        }
        const decodeToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user= await User.findById(decodeToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(400, "Invalid Access Token");
        }
        req.user=user
        next();

    } catch (error) {
        throw new ApiError(400, "Invalid Access Token error")
    }

})