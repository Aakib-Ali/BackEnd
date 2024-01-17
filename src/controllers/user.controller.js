import asynchandler from '../utils/asynchandler.js';
import ApiError from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import ApiResponse from '../utils/ApiResponse.js'
import generateAccessAndrefreshToken from '../utils/GenerateTokens.js';

//register User
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
        $or: [{userName}, {email}]
    });
    if(existedUser){
        throw new ApiError(409, "User existes with the same name or email")
    }

    //take file using multer and upload
    const avatarLocalPath = req.files?.avatar[0]?.path

    //this can use when coverImage is mendetory
    // const coverImagePath= req.files?.coverImage[0]?.path

    //alernate when value is undefined
    let coverImagePath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImagePath=req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(422,'Avatar is missing')
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImagePath);
    if(!avatar){
        throw new ApiError(422,'Avatar is missing')
    } 
    // console.log(avatar.url);
    const user = await User.create({
        fullName,
        avatar: avatar.url,
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



//loginUser
const loginUser = asynchandler (async (req,res)=>{
    const {userName, email,password} = req.body;
    //checking validation
    if(!userName && !email){
        throw new ApiError(400,"email or password is required")
    }
    const user = await User.findOne({
        $or : [{email},{userName}]
    })
    if(!user){
        throw new ApiError(400, "Please enter valid Credential")
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400, "Please enter correct password");
    }

    const {accessToken,refreshToken}= await generateAccessAndrefreshToken(user._id);
    
    //logged in user details

    const loggedUser= await User.findById(user._id).select("-password -refreshToken");

    //cookies
    const options={
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedUser,accessToken,refreshToken
            },
            "User logged In successfully !!!!"
        )
    )

})


//logout User
const logoutUser = asynchandler( async (req,res)=>{
    //remove the access token and refresh token from cookies
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                'refreshToken':null
            }
        },
        {
            new: true
        }
    )

    const options={
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200,
        {},
        "User logged out successfully"
        ))
    
})

export { registerUser,
    loginUser,
    logoutUser
}