import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { Roles } from "../../src/constants";
describe("POST /auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

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

        it("should persist the user in the database", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "test123@gmail.com",
                password: "secret",
            };
            await request(app).post("/auth/register").send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        it("should return the user id in the response", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "test123@gmail.com",
                password: "secret",
            };
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.body).toHaveProperty("id");
            const repository = connection.getRepository(User);
            const users = await repository.find();
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            );
        });

        it("should assign a customer role", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "test123@gmail.com",
                password: "secret",
                role: Roles.CUSTOMER,
            };
            await request(app).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });

        it("should store the hash password in the database", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "test123@gmail.com",
                password: "secret",
            };
            await request(app).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2[a|b]\$\d+\$/);
        });
    });
    describe("given missing fields", () => {});
});
