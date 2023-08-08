import request from "supertest";

import { app } from "../src/app.js";
import { user } from "../src/models/user.js";

import "../src/database/db.js";

const test = {
    name: "Test",
    email: "test@test.com",
    password: "1234567890",
};

describe("PUT /users/:id", () => {
    describe("Update address", () => {
        describe("Given empty fields", () => {
            it("Should return status 400", async () => {
                await user.deleteMany({});
                await request(app).post("/api/users/register").send(test);

                const token = await request(app)
                    .post("/api/users/login")
                    .send(test)
                    .then((response) => response.body.token);

                const response = await request(app)
                    .put("/api/users/updateAddress")
                    .set("x-access-token", token)
                    .send({});

                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe("Missing fields");
            });
        });

        describe("Given valid fields", () => {
            it("Should return status 200 and the user updated", async () => {
                await user.deleteMany({});
                await request(app).post("/api/users/register").send(test);

                const token = await request(app)
                    .post("/api/users/login")
                    .send(test)
                    .then((response) => response.body.token);

                const response = await request(app)
                    .put("/api/users/updateAddress")
                    .set("x-access-token", token)
                    .send({
                        address: "Cra 1 # 1 - 1",
                    });

                expect(response.statusCode).toBe(200);
                expect(response.body.user).toEqual(
                    expect.objectContaining({
                        address: "Cra 1 # 1 - 1",
                    })
                );
            });
        });
    });

    describe("Update profile picture", () => {
        describe("Not given a file", () => {
            it("Should return status 400", async () => {
                await user.deleteMany({});
                await request(app).post("/api/users/register").send(test);

                const token = await request(app)
                    .post("/api/users/login")
                    .send(test)
                    .then((response) => response.body.token);

                const response = await request(app)
                    .put("/api/users/updateProfilePicture")
                    .set("x-access-token", token);

                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe("Missing files");
            });
        });

        describe("Given a file", () => {
            it("Should return status 200 and the user updated", async () => {
                await user.deleteMany({});
                await request(app).post("/api/users/register").send(test);

                const token = await request(app)
                    .post("/api/users/login")
                    .send(test)
                    .then((response) => response.body.token);

                const response = await request(app)
                    .put("/api/users/updateProfilePicture")
                    .set("x-access-token", token)
                    .attach("profilePicture", "./tests/assets/test.avif");

                expect(response.statusCode).toBe(200);
                expect(response.body.user).toEqual(
                    expect.objectContaining({
                        profilePicture: {
                            url: expect.any(String),
                            public_id: expect.any(String),
                        },
                    })
                );
            });
        });
    });
});
