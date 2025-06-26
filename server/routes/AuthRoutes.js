import { Router } from "express";
import {
  addProfileImage,
  getUserInfo,
  login,
  signup,
  updateProfile,
  removeProfileImage,
  logout,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from 'multer';
import { profileStorage } from "../utils/storage.js";


const authRoutes = Router();
const upload = multer({storage: profileStorage});

authRoutes.post("/signup",signup);
authRoutes.post("/login",login);
authRoutes.get('/user-info',verifyToken,getUserInfo);
authRoutes.post("/update-profile",verifyToken,updateProfile);
authRoutes.post("/add-profile-image", verifyToken,upload.single("profile-image"), addProfileImage);
authRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage);
authRoutes.post('/logout',logout);

export default authRoutes;