import asynchandler from '../utils/asynchandler.js';
import ApiError from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import ApiResponse from '../utils/ApiResponse.js'

const registerUser = asynchandler( async (req,res)=>{
    //get details from form
    //validate like empty or not
    //already exist or not
    //check avatar or image
    //store in cloudinary
    //create user entry
    //remove pass adn ref token from response
    //user regirter or not
    //show response to user

    const {userName, email, fullName, password} =req.body;
    if([userName,email,fullName,password].some((field)=>
        field?.trim()==="")){
            throw new ApiError(400,"All fieds are required");
        }
    const existedUser  = await User.findOne({
        $or:[{userName}, {email}]
    });
    if(!existedUser){
        throw new ApiError(409, "User existes with the same name or email")
    }

    //take file using multer and upload
    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log(req.files);
    const coverImagePath= req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(422,'Avatar is missing')
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImagePath);
    if(!avatar){
        throw new ApiError(422,'Avatar is missing')
    }

    const user = await User.create({
        fullName,
        avatar: avatar,
        userName: userName.toLowerCase(),
        //if url is there take other empty string
        coverImage: coverImage?.url || "",
        email,
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreceToken"
    )
    
    if(!createdUser){
        throw new ApiError(500, "Something went wrong at regiter user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User register successfully")
    )
})

export default registerUser;