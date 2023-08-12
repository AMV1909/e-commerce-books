import request from "supertest";

import { app } from "../src/app.js";
import { product } from "../src/models/product.js";
import { generateToken } from "../src/jwt/jwt.js";

import "../src/database/db.js";
import {
    validateStock,
    validateTypeProduct,
} from "../src/schemas/product.schema.js";

const test = {
    code: "1",
    name: "Test",
    price: 10,
    stock: 10,
    type: "product",
};

describe("GET /products", () => {
    describe("Get all products", () => {
        it("Should return status 200 and all products", async () => {
            await product.deleteMany({});
            await product.create(test);

            const response = await request(app).get("/api/products");

            expect(response.statusCode).toBe(200);
            expect(typeof response.body.products).toBe("object");
        });
    });

    describe("Get a product by its code", () => {
        it("Should return status 200 and the product", async () => {
            await product.deleteMany({});
            await product.create(test);

            const response = await request(app).get("/api/products/1");

            expect(response.statusCode).toBe(200);
            expect(response.body.product).toEqual(
                expect.objectContaining({
                    code: test.code,
                    name: test.name,
                    price: test.price,
                    stock: test.stock,
                })
            );
        });
    });
});

describe("POST /products", () => {
    describe("Not being an admin", () => {
        it("Should return status 401", async () => {
            const response = await request(app)
                .post("/api/products")
                .set("x-access-token", generateToken({ admin: false }, "1m"))
                .send(test);

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("Unauthorized");
        });
    });

    describe("Given empty fields", () => {
        it("Should return status 400", async () => {
            const response = await request(app)
                .post("/api/products")
                .set("x-access-token", generateToken({ admin: true }, "1m"))
                .send({});

            const result = validateTypeProduct();

            expect(response.statusCode).toBe(400);
            expect(response.body.issues).toEqual(result.error.issues);
        });
    });

    describe("Given valid fields", () => {
        it("Should return status 201 and the product", async () => {
            await product.deleteMany({});

            const response = await request(app)
                .post("/api/products")
                .set("x-access-token", generateToken({ admin: true }, "1m"))
                .send(test);

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(
                expect.objectContaining({
                    code: test.code,
                    name: test.name,
                    price: test.price,
                    stock: test.stock,
                })
            );
        });
    });
});

describe("PUT /products/:code", () => {
    describe("Not being an admin", () => {
        it("Should return status 401", async () => {
            const response = await request(app)
                .put("/api/products/1")
                .set("x-access-token", generateToken({ admin: false }, "1m"))
                .send(test);

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("Unauthorized");
        });
    });

    describe("Given empty fields", () => {
        it("Should return status 400", async () => {
            const response = await request(app)
                .put("/api/products/1")
                .set("x-access-token", generateToken({ admin: true }, "1m"))
                .send({});

            const result = validateTypeProduct();

            expect(response.statusCode).toBe(400);
            expect(response.body.issues).toEqual(result.error.issues);
        });
    });

    describe("Given valid fields", () => {
        it("Should return status 200 and the product", async () => {
            await product.deleteMany({});
            await product.create(test);

            const response = await request(app)
                .put("/api/products/1")
                .set("x-access-token", generateToken({ admin: true }, "1m"))
                .send(test);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    code: test.code,
                    name: test.name,
                    price: test.price,
                    stock: test.stock,
                })
            );
        });
    });
});

describe("PUT /products/stock/:code", () => {
    describe("Not being an admin", () => {
        it("Should return status 401", async () => {
            const response = await request(app)
                .put("/api/products/stock/1")
                .set("x-access-token", generateToken({ admin: false }, "1m"))
                .send(test);

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("Unauthorized");
        });
    });

    describe("Given empty fields", () => {
        it("Should return status 400", async () => {
            const response = await request(app)
                .put("/api/products/stock/1")
                .set("x-access-token", generateToken({ admin: true }, "1m"))
                .send();

            const result = validateStock();

            expect(response.statusCode).toBe(400);
            expect(response.body.issues).toEqual(result.error.issues);
        });
    });

    describe("Given valid fields", () => {
        it("Should return status 200 and the product", async () => {
            await product.deleteMany({});
            await product.create(test);

            const response = await request(app)
                .put("/api/products/stock/1")
                .set("x-access-token", generateToken({ admin: true }, "1m"))
                .send({ stock: test.stock });

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toEqual(
                expect.objectContaining({
                    stock: test.stock,
                })
            );
        });
    });
});

describe("DELETE /products/:code", () => {
    describe("Not being an admin", () => {
        it("Should return status 403", async () => {
            const response = await request(app)
                .delete("/api/products/1")
                .set("x-access-token", generateToken({ admin: false }, "1m"))
                .send(test);

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("Unauthorized");
        });
    });

    describe("Being an admin", () => {
        it("Should return status 200 and a message", async () => {
            await product.deleteMany({});
            await product.create(test);

            const response = await request(app)
                .delete("/api/products/1")
                .set("x-access-token", generateToken({ admin: true }, "1m"))
                .send(test);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: "Product deleted",
                })
            );
        });
    });
});
