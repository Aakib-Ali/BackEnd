import { Router } from "express";
import {
    changePassword,
    channel, 
    getCurrentUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAvatar, 
    updateCoverImage, 
    updateDetails, 
    watchHistory
} from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router();

 router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },{
            name: "coverImage",
            maxCount:1
        }
    ]),registerUser);
router.route('/login').post(loginUser)

//secure
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/refresh-Token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT,changePassword);
router.route('/current-user').get(verifyJWT,getCurrentUser);
router.route('/update-details').patch(verifyJWT,updateDetails);
router.route('/update-avatar').patch(verifyJWT,upload.single("avatar"),updateAvatar);
router.route('/update-cover').patch(verifyJWT,upload.single("coverImage"),updateCoverImage);
router.route('/channle/:userName').get(verifyJWT,channel);
router.route('/history').get(verifyJWT,watchHistory);

export default router;