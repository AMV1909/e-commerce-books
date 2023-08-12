import request from "supertest";

import { app } from "../src/app.js";
import { user } from "../src/models/user.js";
import { product } from "../src/models/product.js";
import { validateProductCart } from "../src/schemas/productCart.schema.js";

import "../src/database/db.js";

const test = {
    name: "Test",
    email: "test@test.com",
    password: "1234567890",
};

const productTest = {
    code: "123456",
    name: "Test",
    price: 10,
    stock: 10,
    type: "product",
};

describe("GET /productsCart", () => {
    it("Should return status 200 and all products in cart", async () => {
        await user.deleteMany({});
        await request(app).post("/api/users/register").send(test);

        const token = await request(app)
            .post("/api/users/login")
            .send(test)
            .then((response) => response.body.token);

        const response = await request(app)
            .get("/api/productsCart")
            .set("x-access-token", token);

        expect(response.statusCode).toBe(200);
        expect(response.body.productsCart).toBeTruthy();
    });
});

describe("POST /productsCart", () => {
    describe("Given empty fields", () => {
        it("Should return status 400", async () => {
            await user.deleteMany({});
            await request(app).post("/api/users/register").send(test);

            const token = await request(app)
                .post("/api/users/login")
                .send(test)
                .then((response) => response.body.token);

            const response = await request(app)
                .post("/api/productsCart")
                .set("x-access-token", token)
                .send({});

            const result = validateProductCart({});

            expect(response.statusCode).toBe(400);
            expect(response.body.issues).toEqual(result.error.issues);
        });
    });

    describe("Given valid fields", () => {
        it("Should return status 200 and the product added", async () => {
            await user.deleteMany({});
            await product.deleteMany({});
            await request(app).post("/api/users/register").send(test);
            await product.create(productTest);

            const token = await request(app)
                .post("/api/users/login")
                .send(test)
                .then((response) => response.body.token);

            const response = await request(app)
                .post("/api/productsCart")
                .set("x-access-token", token)
                .send({ code: "123456", quantity: 1 });

            expect(response.statusCode).toBe(201);
            expect(response.body.productCart).toBeTruthy();
        });
    });
});
