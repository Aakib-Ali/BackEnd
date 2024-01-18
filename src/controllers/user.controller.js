import asynchandler from '../utils/asynchandler.js';
import ApiError from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import ApiResponse from '../utils/ApiResponse.js'
import generateAccessAndrefreshToken from '../utils/GenerateTokens.js';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
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
            $unset :{
                refreshToken: 1 // unset use to delete token
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

//refreshToken after accessToken expire
const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(400, "Invalid Refresh Token");
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // Setting the access token and sending it to the client side
        const { accessToken, newRefreshToken } = await generateAccessAndrefreshToken(user._id);
        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json({
                newRefreshToken,
                accessToken,
                message: "Access token refreshed!!!",
            });
    } catch (error) {
        throw new ApiError(401, error.message || "Refresh token is invalid", "Refresh token is Invalid");
    }
};


// changePassword
const changePassword = asynchandler(async (req, res) => {
    try {
        let { password, currentPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isPasswordValid = await user.isPasswordCorrect(currentPassword);

        if (!isPasswordValid) {
            throw new ApiError(401, "Current password is not correct!!");
        }

        user.password = password;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: "Password changed successfully!!",
        });
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error", "Failed to change password");
    }
});

const getCurrentUser= asynchandler ( async (req,res)=>{  //using auth middleware for req.user
    return res.status(200)
    .json(new ApiResponse(200,req.user,"Current user Fatched succefully"))
})

const updateDetails = asynchandler ( async (req,res)=>{
    const {fullName ,email } = req.body;
    if(!fullName || !email){
        throw new ApiError(401, "All field are required")
    }
    const user =await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {email, fullName}
        },{
            new: true
        }
    ).select("-password")

    return res.status(200)
    .json( new ApiResponse(200, user,"Updated successfully"))
})

//Todo delete avatar before save new avatar and coverimage also
const updateAvatar = asynchandler (async (req,res)=>{
    const avatarLocalPath  = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(401, "Avatar is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url){
        throw new ApiError(501, " Avatar url is missing!!")
    }
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },{
            new : true
        }
    ).select("-password")
    return res.status(200)
    .json(new ApiResponse(200,user,"avatar Updated success Fully" ))
})

const updateCoverImage = asynchandler (async (req,res)=>{
    const coverImageLocalPath  = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(401, "Cover image is missing")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage.url){
        throw new ApiError(501, " cover image url is missing!!")
    }
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },{
            new : true
        }
    ).select("-password")
    return res.status(200)
    .json(new ApiResponse(200,user,"coverImage Updated success Fully" ))
})

const channel = asynchandler ( async (req,res)=>{
    const {userName} = req.params
    if(!userName?.trim()){
        throw new ApiError(400, "username is missing")
    }
    
    //pipelines
    const channel = await User.aggregate([
        {
            //match user is exits and take data like forign key
            $match:{
                userName : userName?.toLowerCase()
            }
        },
        {
            //we are looking for subscribers for the channel throw channle
            $lookup:{
                from : "subcriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            //we are looking for the maine kise subscribe kar rkha he throw subscribrs
            $lookup:{
                from : "subcriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribeTo"
            }
        },
        {
            //add fields into our user fiels 
            $addFields:{
                //count no of subcribers
                subcsribersCount: {
                    $size: "$subscribers"
                },
                //count how many i have subscribed
                channerlsSubscredToCount:{
                    $size: "$subscribeTo"
                },
                isSubscribed:{
                    //here it is chaking that this profile use is my sbscriber or not
                    $cond:{
                        if: {$in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullName:1,
                email: 1,
                userName:1,
                subcsribersCount: 1,
                channerlsSubscredToCount: 1,
                coverImage :1,
                avatar : 1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404, "channel does not exist!!!!")
    }
    //console.log(channle);
    return res.status(200)
    .json(new ApiResponse(200, channel[0], "user channel fetched successfully!!!"))

})
const watchHistory = asynchandler(async (req, res) => {
    // Step 1: Match the user by their _id
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        // Step 2: Lookup the videos in the user's watchHistory
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    // Step 3: Lookup the owner of each video
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "id",
                            as: "owner",
                            pipeline: [
                                // Step 4: Project only necessary fields for the owner
                                {
                                    $project: {
                                        fullName: 1,
                                        avatar: 1,
                                        userName: 1
                                    }
                                },
                                // Step 5: Add a new field 'owner' with the first element of the 'owner' array
                                {
                                    $addFields: {
                                        owner: {
                                            $first: "$owner"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]);
    
    return res.status(200)
    .json(
        new ApiResponse(200, user[0].watchHistory, "Watch Histroy of user is fetched!!!")
    )
});

export { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateDetails,
    updateAvatar,
    updateCoverImage,
    channel,
    watchHistory
}