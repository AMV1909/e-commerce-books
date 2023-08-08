import { object, boolean, string } from "zod";

const adminSchema = object({
    admin: boolean().default(true),
    name: string().nonempty(),
    email: string().email(),
    password: string().min(8),
});

export const validateAdmin = (admin) => adminSchema.safeParse(admin);
