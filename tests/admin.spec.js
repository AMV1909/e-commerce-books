import request from "supertest";

import { app } from "../src/app.js";
import { user } from "../src/models/user.js";
import { generateToken } from "../src/jwt/jwt.js";
import { validateAdmin } from "../src/schemas/admin.schema.js";

import "../src/database/db.js";

const test = {
    admin: true,
    name: "Test",
    email: "test@test.com",
    password: "1234567890",
};

describe("POST /admins", () => {
    describe("Should let create only one admin without being and admin", () => {
        it("Should return status 201 and the admin if there's not an admin", async () => {
            await user.deleteMany({});

            const response = await request(app)
                .post("/api/admins")
                .set("x-access-token", generateToken({ admin: false }, "1m"))
                .send(test);

            console.log(response.body);

            expect(response.statusCode).toBe(201);
            expect(response.body.user).toEqual(
                expect.objectContaining({
                    name: test.name,
                    email: test.email,
                })
            );
        });

        it("Should return status 401 if there's an admin", async () => {
            await user.deleteMany({});
            await user.create(test);

            const response = await request(app)
                .post("/api/admins")
                .set("x-access-token", generateToken({ admin: false }, "1m"))
                .send(test);

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Unauthorized");
        });
    });

    describe("Given empty fields", () => {
        it("Should return status 400", async () => {
            const response = await request(app)
                .post("/api/admins")
                .set("x-access-token", generateToken({ admin: true }, "1m"))
                .send({});

            const result = validateAdmin({});

            expect(response.statusCode).toBe(400);
            expect(response.body.issues).toEqual(result.error.issues);
        });
    });

    describe("Given valid fields", () => {
        it("Should return status 201 and the admin", async () => {
            await user.deleteMany({});

            const response = await request(app)
                .post("/api/admins")
                .set("x-access-token", generateToken({ admin: true }, "1m"))
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

describe("DELETE /admins/:id", () => {
    describe("Not being an admin", () => {
        it("Should return status 403", async () => {
            const response = await request(app)
                .delete("/api/admins/123")
                .set("x-access-token", generateToken({ admin: false }, "1m"));

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("Unauthorized");
        });
    });

    describe("Given an invalid id", () => {
        it("Should return status 404 User Not Found", async () => {
            const response = await request(app)
                .delete("/api/admins/123")
                .set("x-access-token", generateToken({ admin: true }, "1m"));

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("User not found");
        });
    });

    describe("Being an admin", () => {
        it("Should return status 200", async () => {
            await user.deleteMany({});
            const { _id: adminId } = await user.create(test);

            const response = await request(app)
                .delete(`/api/admins/${adminId}`)
                .set("x-access-token", generateToken({ admin: true }, "1m"));

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Admin deleted");
        });
    });
});
