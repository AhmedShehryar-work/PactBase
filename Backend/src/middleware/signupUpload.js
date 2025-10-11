import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Determine if image needs face centering
    const faceCentered = ["profileImage", "image1", "image2", "image3"].includes(file.fieldname);
    const isProfile = file.fieldname === "profileImage";

    return {
      folder: isProfile ? "users" : "verification",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: faceCentered
        ? [
            {
              width: 500,
              height: 500,
              crop: "fill",
              gravity: "face",
              quality: "auto",
              fetch_format: "auto",
            },
          ]
        : [
            {
              quality: "auto",
              fetch_format: "auto",
            },
          ],
    };
  },
});

const upload = multer({ storage }).fields([
  { name: "profileImage", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "cnicFront", maxCount: 1 },
  { name: "cnicBack", maxCount: 1 },
]);

const signupUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Files upload failed:", err);
      return res.status(500).json({ success: false, message: "File upload failed" });
    }
    next(); // All files uploaded successfully
  });
};

export default signupUpload;
