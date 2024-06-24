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
                password: "secasddret",
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
                password: "secasdasret",
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
                password: "secrasdasdet",
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
                password: "secasdadret",
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
                password: "secrasdaset",
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
                password: "secasdret",
            };
            await request(app).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2[a|b]\$\d+\$/);
        });

        it("should check if email already exists", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "test123@gmail.com",
                password: "seasdadcret",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            const users = await userRepository.find();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });
    });
    describe("given missing fields", () => {
        it("should return 400 status code if email field is missing", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "",
                password: "secasasdret",
            };
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(0);
        });

        it("should return 400 status code if firstName field is missing", async () => {
            const userData = {
                firstName: "",
                lastName: "Doe",
                email: "test@123",
                password: "seasdadcret",
            };
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.statusCode).toBe(400);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(0);
        });

        it("should return 400 status code if lastName field is missing", async () => {
            const userData = {
                firstName: "john",
                lastName: "",
                email: "test@123",
                password: "sadadecret",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(0);
        });
        it("should return 400 status code if password field is missing", async () => {
            const userData = {
                firstName: "john",
                lastName: "doe",
                email: "test@123",
                password: "",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(0);
        });
    });

    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: " abhijit@k.sp ",
                password: "asdsecret",
            };
            await request(app).post("/auth/register").send(userData);

            const userRepositry = connection.getRepository(User);
            const users = await userRepositry.find();
            const user = users[0];
            expect(user.email).toBe("abhijit@k.sp");
        });

        it("should return 400 status code if email is not a valid email", async () => {
            const userData = {
                firstName: "john",
                lastName: "doe",
                email: "test",
                password: "qweqasde",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.statusCode).toBe(400);
        });

        it("should return 400 status code if password length is less than 8 characters", async () => {
            const userData = {
                firstName: "john",
                lastName: "doe",
                email: "test@gmail.com",
                password: "adear",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.statusCode).toBe(400);
        });

        it("shoud return an array of error messages if email is missing", async () => {
            // Arrange
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "",
                password: "password",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.body).toHaveProperty("errors");
            expect(
                (response.body as Record<string, string>).errors.length,
            ).toBeGreaterThan(0);
        });
    });
});
