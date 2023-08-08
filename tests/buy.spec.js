import request from "supertest";

import { app } from "../src/app.js";
import { user } from "../src/models/user.js";
import { product } from "../src/models/product.js";
import { generateToken } from "../src/jwt/jwt.js";

import "../src/database/db.js";
import { validateBuy, validateDirectBuy } from "../src/schemas/buy.schema.js";

const test = {
    admin: true,
    name: "Test",
    email: "test@test.com",
    password: "1234567890",
};

const productTest = {
    code: "123",
    name: "Test",
    price: 10,
    stock: 10,
    type: "product",
};

describe("GET /sales", () => {
    describe("Without being an admin", () => {
        it("Should return status 401", async () => {
            const response = await request(app)
                .get("/api/sales")
                .set("x-access-token", generateToken({ admin: false }, "1m"));

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("Unauthorized");
        });
    });

    describe("Being an admin", () => {
        it("Should return status 200 and the sales", async () => {
            const response = await request(app)
                .get("/api/sales")
                .set("x-access-token", generateToken({ admin: true }, "1m"));

            expect(response.statusCode).toBe(200);
            expect(typeof response.body.sales).toBe("object");
        });
    });
});

describe("POST /buy", () => {
    describe("Buying a product", () => {
        describe("Given empty fields", () => {
            it("Should return status 400", async () => {
                const response = await request(app)
                    .post("/api/buy")
                    .set(
                        "x-access-token",
                        generateToken({ admin: false }, "1m")
                    )
                    .send({});

                const result = validateDirectBuy({});

                expect(response.statusCode).toBe(400);
                expect(response.body.issues).toEqual(result.error.issues);
            });
        });

        describe("Given an invalid quantity", () => {
            it("Should return status 400 and a message", async () => {
                const response = await request(app)
                    .post("/api/buy")
                    .set(
                        "x-access-token",
                        generateToken({ admin: false }, "1m")
                    )
                    .send({
                        code: "123",
                        quantity: "invalid",
                        distributor: "Servientrega",
                    });

                const result = validateDirectBuy({
                    code: "123",
                    quantity: "invalid",
                    distributor: "Servientrega",
                });

                expect(response.statusCode).toBe(400);
                expect(response.body.issues).toEqual(result.error.issues);
            });
        });

        describe("Given an invalid code of product", () => {
            it("Should return status 400 and a message", async () => {
                const response = await request(app)
                    .post("/api/buy")
                    .set(
                        "x-access-token",
                        generateToken({ admin: false }, "1m")
                    )
                    .send({
                        code: "invalid",
                        quantity: 1,
                        distributor: "Servientrega",
                    });

                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe("Product not found");
            });
        });

        describe("Given a quantity greater than the stock", () => {
            it("Should return status 400 and a message", async () => {
                await product.deleteMany({});
                await product.create(productTest);

                const response = await request(app)
                    .post("/api/buy")
                    .set(
                        "x-access-token",
                        generateToken({ admin: false }, "1m")
                    )
                    .send({
                        code: productTest.code,
                        quantity: 1000000,
                        distributor: "Servientrega",
                    });

                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe("Insufficient stock");
            });
        });

        describe("Given a valid request", () => {
            it("Should return status 201 and the sale", async () => {
                await product.deleteMany({});
                await product.create(productTest);

                const response = await request(app)
                    .post("/api/buy")
                    .set(
                        "x-access-token",
                        generateToken({ admin: false }, "1m")
                    )
                    .send({
                        code: productTest.code,
                        quantity: 1,
                        distributor: "Servientrega",
                    });

                expect(response.statusCode).toBe(201);
                expect(typeof response.body.sale).toBe("object");
            });
        });
    });
});

describe("POST /buy/cart", () => {
    describe("Given empty fields", () => {
        it("Should return status 400", async () => {
            const response = await request(app)
                .post("/api/buy/cart")
                .set("x-access-token", generateToken({ admin: false }, "1m"))
                .send({});

            const result = validateBuy({});

            expect(response.statusCode).toBe(400);
            expect(response.body.issues).toEqual(result.error.issues);
        });
    });

    describe("Cart is empty", () => {
        it("Should return status 400", async () => {
            await user.deleteMany({});
            await request(app).post("/api/users/register").send(test);

            const token = await request(app)
                .post("/api/users/login")
                .send(test)
                .then((response) => response.body.token);

            const response = await request(app)
                .post("/api/buy/cart")
                .set("x-access-token", token)
                .send({
                    distributor: "Servientrega",
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Cart is empty");
        });
    });

    describe("Cart is not empty and given a valid request", () => {
        it("Should return status 201 and the sale", async () => {
            await user.deleteMany({});
            await request(app).post("/api/users/register").send(test);

            const token = await request(app)
                .post("/api/users/login")
                .send(test)
                .then((response) => response.body.token);

            await product.deleteMany({});
            await product.create(productTest);

            await request(app)
                .post("/api/productsCart")
                .set("x-access-token", token)
                .send({
                    code: productTest.code,
                    quantity: 1,
                });

            const response = await request(app)
                .post("/api/buy/cart")
                .set("x-access-token", token)
                .send({
                    distributor: "Servientrega",
                });

            expect(response.statusCode).toBe(201);
            expect(typeof response.body.sale).toBe("object");
        });
    });
});
