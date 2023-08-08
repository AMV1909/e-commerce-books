import fs from "fs-extra";

import { user } from "../models/user.js";
import { deleteImage, uploadImage } from "../libs/cloudinary.js";

// Update user address
// This function can be used for adding if the user doesn't have an address
// or updating if the user already has an address
export const updateAddress = async (req, res) => {
    // Check if the fields are empty
    if (!req.body.address)
        return res.status(400).json({ message: "Missing fields" });

    // Update the address
    // The _id comes from the token decoded in the middleware
    await user
        .findOneAndUpdate(
            { _id: req.decoded._id },
            { $set: { address: req.body.address } },
            { new: true }
        )
        .then((user) => res.status(200).json({ user }))
        .catch((err) => res.status(400).json({ err }));
};

// Update user profile picture
// This function can be used for adding if the user doesn't have a profile picture
// or updating if the user already has a profile picture
export const updateProfilePicture = async (req, res) => {
    // Check if the fields are empty
    if (!req.files)
        return res.status(400).json({ message: "Missing files" });

    // Update the profile picture
    // The _id comes from the token decoded in the middleware
    await user
        .findById(req.decoded._id)
        .then(async (data) => {
            // If the user already has a profile picture, delete it
            // We don't need now the old profile picture
            // The deleteImage function is in src\libs\cloudinary.js
            if (data.profilePicture.public_id)
                await deleteImage(data.profilePicture.public_id);

            // Upload the new profile picture
            // The uploadImage function is in src\libs\cloudinary.js
            // The req.files.profilePicture.tempFilePath is the path of the temp file
            // The path where is located is in the middleware in app.js
            await uploadImage(req.files.profilePicture.tempFilePath)
                .then((result) => {
                    // We need to save the url and the public_id to use it later
                    req.body.profilePicture = {
                        url: result.secure_url,
                        public_id: result.public_id,
                    };
                })
                .catch((err) => res.status(400).json({ err }));

            // Delete temp file
            // We don't need it now
            await fs.unlink(req.files.profilePicture.tempFilePath);

            // Update the profile picture
            await user
                .findOneAndUpdate(
                    { _id: req.decoded._id },
                    { $set: { profilePicture: req.body.profilePicture } },
                    { new: true }
                )
                .then((user) => res.status(200).json({ user }))
                .catch((err) => res.status(400).json({ err }));
        })
        .catch((err) => res.status(400).json({ err }));
};
