import { v2 as cloudinary } from 'cloudinary'
//file system which allows to read write and all the operation on file
import fs from 'fs'

//configure cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});

//upload data on cloudinary using localpath

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : 'auto'
        })
        //file uploadded succefylly
        console.log("successfully uploaded" , response.url);
    } catch (error) {
        //unlink file on any error from temporary pulic file
        fs.unlinkSync(localFilePath)
        return null;
        
    }

}
