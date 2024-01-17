import { User } from '../models/user.model.js';
import ApiError from './ApiError.js';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            // If the user with the provided ID is not found, throw an error
            throw new ApiError(404, "User not found");
        }

        // Generate access and refresh tokens
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // Save the refresh token to the user document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Return the generated tokens
        return { accessToken, refreshToken };
    } catch (error) {
        // Log the error details for debugging
        console.error("Error generating tokens:", error);

        // Rethrow the error to maintain consistent error handling
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

export default generateAccessAndRefreshToken;
