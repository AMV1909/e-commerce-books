import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();

// Configure Cloudinary
// We use env variables to hide sensitive data
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image to Cloudinary
// filePath: path of the image to be uploaded
// folder: folder in which the image will be stored
export const uploadImage = async (filePath, folder) => {
    return await cloudinary.uploader
        .upload(filePath, { folder })
        .catch((err) => {
            throw err;
        });
};

// Delete an image from Cloudinary
// publicId: public id of the image to be deleted
export const deleteImage = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId).catch((err) => {
        throw err;
    });
};
