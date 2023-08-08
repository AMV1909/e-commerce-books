import { object, boolean, string } from "zod";

const userSchema = object({
    admin: boolean().default(false),
    name: string().nonempty(),
    email: string().email(),
    password: string().min(8),
});

const userLoginSchema = object({
    email: string().email(),
    password: string(),
});

const userUpdateAddressSchema = object({
    address: string().nonempty(),
});

export const validateUser = (user) => userSchema.safeParse(user);

export const validateUserLogin = (user) => userLoginSchema.safeParse(user);

export const validateUserUpdateAddress = (user) =>
    userUpdateAddressSchema.safeParse(user);
