import request from "supertest";
import app from "../../src/app";
describe("POST /auth/register", () => {
    describe("given all fields", () => {
        it("should return 201 status code", async () => {
            //AAA
            //Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "test123@gmail.com",
                password: "secret",
            };
            //Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(201);
        });

        it("should return valid json response", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "test123@gmail.com",
                password: "secret",
            };
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });
    });
    describe("given missing fields", () => {});
});
