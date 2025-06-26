import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

export const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat-app/profile-pictures",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat-app/files",
    allowed_formats: ["jpg", "png", "webp", "pdf", "doc", "mp4", "zip"],
  },
});
