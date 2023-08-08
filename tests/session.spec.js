import request from "supertest";
import { createHash } from "crypto";

import { app } from "../src/app.js";
import { user } from "../src/models/user.js";

import "../src/database/db.js";

let test = {
    name: "Test",
    email: "test@test.com",
    password: "1234567890",
};

describe("POST /users/register", () => {
    describe("Given empty fields", () => {
        it("Should return status 400", async () => {
            const response = await request(app)
                .post("/api/users/register")
                .send({});

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Missing fields");
        });
    });

    describe("Given an email that already exists", () => {
        it("Should return status 400 and a message", async () => {
            await user.deleteMany({});
            await user.create(test);

            const response = await request(app)
                .post("/api/users/register")
                .send(test);

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Email already exists");
        });
    });

    describe("Given valid fields", () => {
        it("Should return status 201 and the user if the fields are valid", async () => {
            await user.deleteMany({});

            const response = await request(app)
                .post("/api/users/register")
                .send(test);

            expect(response.statusCode).toBe(201);
            expect(response.body.user).toEqual(
                expect.objectContaining({
                    name: test.name,
                    email: test.email,
                })
            );
        });
    });
});

describe("POST /users/login", () => {
    describe("Given empty fields", () => {
        it("Should return status 400", async () => {
            const response = await request(app)
                .post("/api/users/login")
                .send({});

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Missing fields");
        });
    });

    describe("Given invalid credentials", () => {
        it("Should return status 404", async () => {
            const response = await request(app)
                .post("/api/users/login")
                .send({ email: "a", password: "b" });

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("Invalid credentials");
        });
    });

    describe("Given valid credentials", () => {
        it("Should return status 200 and the token", async () => {
            await user.deleteMany({});
            await request(app).post("/api/users/register").send(test);

            const response = await request(app)
                .post("/api/users/login")
                .send(test);

            expect(response.statusCode).toBe(200);
            expect(typeof response.body.token).toBe("string");
        });
    });
});
