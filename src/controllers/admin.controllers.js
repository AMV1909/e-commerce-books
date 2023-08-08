import { createHash } from "crypto";
import { user } from "../models/user.js";
import { validateAdmin } from "../schemas/admin.schema.js";

// Create admin
/* The system will need at least one admin to work,
(normal users shouldn't be able to create products), 
but only an admin can create another admin, so, to 
avoid that, the code is programming to let create 
just one admin without being an admin, after that, 
it won't let create another without permissions */
export const createAdmin = async (req, res) => {
    // Validate the fields
    const result = validateAdmin(req.body);

    // If the fields are invalid, return an error
    if (!result.success) return res.status(400).json(result.error);

    // Function to create the admin, I created this function to avoid repeating code
    const create = async () => {
        // Encrypt the password
        result.data.password = createHash("sha256")
            .update(result.data.password)
            .digest("base64");

        // Create the admin
        await user
            .create(result.data)
            .then((user) => res.status(201).json({ user }))
            .catch((err) => res.status(400).json({ err }));
    };

    if (req.decoded.admin) {
        // If the user is an admin, create the admin
        await create();
    } else {
        // If the user isn't an admin, check if there is an admin
        // If not create the admin, if yes, return an error
        await user
            .findOne({ admin: true })
            .then(async (data) => {
                if (!data) {
                    await create();
                } else {
                    res.status(401).json({ message: "Unauthorized" });
                }
            })
            .catch((err) => res.status(400).json({ err }));
    }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
    // Delete the admin
    await user
        .deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Admin deleted" }))
        .catch(() => res.status(404).json({ message: "User not found" }));
};
