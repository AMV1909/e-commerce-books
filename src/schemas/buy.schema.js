import { object, string, number } from "zod";

const buySchema = object({
    distributor: string().nonempty(),
});

const directBuySchema = buySchema.extend({
    code: string().nonempty(),
    quantity: number().min(1),
});

export const validateBuy = (data) => buySchema.safeParse(data);

export const validateDirectBuy = (data) => directBuySchema.safeParse(data);
