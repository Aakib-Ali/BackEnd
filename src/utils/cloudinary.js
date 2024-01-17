import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // File uploaded successfully
    // console.log('Successfully uploaded', response.url);

    // Return the Cloudinary response
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    // Unlink file on any error from the temporary public file
    fs.unlinkSync(localFilePath);
    
    // Return null in case of an error
    return null;
  }
};

export default uploadOnCloudinary;
