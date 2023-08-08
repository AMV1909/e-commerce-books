import { object, string, number, enum as enum_ } from "zod";

const typeProductSchema = enum_(["book", "product"]);
const stockSchema = number().min(0);

const productSchema = object({
    code: string().nonempty(),
    name: string().nonempty(),
    price: number().min(0),
    stock: stockSchema,
    type: typeProductSchema,
});

const bookSchema = productSchema.extend({
    isbn: string().nonempty(),
    author: string().nonempty(),
    publisher: string().nonempty(),
});

// POST

export const validateTypeProduct = (typeProduct) =>
    typeProductSchema.safeParse(typeProduct);

export const validateProduct = (product) => productSchema.safeParse(product);

export const validateBook = (book) => bookSchema.safeParse(book);

// PUT

export const validateProductUpdate = (product) =>
    productSchema.partial().safeParse(product);

export const validateBookUpdate = (book) =>
    bookSchema.partial().safeParse(book);

export const validateStock = (stock) => stockSchema.safeParse(stock);
