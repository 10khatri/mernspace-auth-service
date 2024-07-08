import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";

describe("POST auth/login", () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });
    beforeEach(async () => {
        await connection.synchronize();
        await connection.dropDatabase();
    });
    afterAll(async () => {
        await connection.destroy();
    });

    describe("given all fields", () => {
        it("should return 200 status code", async () => {
            // Arrange
            // Act
            // Assert
        });
    });
});
