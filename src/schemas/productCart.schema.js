import { object, string, number } from "zod";

const productCartSchema = object({
    code: string().nonempty(),
    quantity: number().int().min(1),
});

export const validateProductCart = (productCart) =>
    productCartSchema.safeParse(productCart);
