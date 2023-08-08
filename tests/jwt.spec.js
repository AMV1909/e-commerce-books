import request from "supertest";

import { app } from "../src/app.js";
import { generateToken } from "../src/jwt/jwt.js";

import "../src/database/db.js";

describe("Verify if the function generateToken generate a valid token", () => {
    test("The function generateToken should return a token as a string", () => {
        const token = generateToken({ name: "John Doe" }, "24h");
        expect(typeof token).toBe("string");
    });
});

describe("Verify token", () => {
    describe("No token provided", () => {
        it("Should return status 403 and a message", async () => {
            const response = await request(app).get("/api/sales");
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("No token provided");
        });
    });

    describe("Invalid token", () => {
        it("Should return status 500 and a message", async () => {
            const response = await request(app)
                .get("/api/sales")
                .set("x-access-token", "invalid token");

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe("Failed to authenticate token");
        });
    });

    describe("Valid token", () => {
        it("Should return status 200 and a continue the request", async () => {
            const response = await request(app)
                .get("/api/sales")
                .set("x-access-token", generateToken({ admin: true }, "1m"));

            expect(response.statusCode).toBe(200);
            expect(typeof response.body.sales).toBe("object");
        });
    });
});
