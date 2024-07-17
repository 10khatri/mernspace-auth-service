import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: UserData) {
        // check if the email already exists
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (user) {
            const err = createHttpError(400, "email already exists");
            throw err;
        }

        // hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {
            const newUser = await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: "customer",
            });
            return newUser;
        } catch (error) {
            const err = createHttpError(500, "failed to store data in db");
            throw err;
        }
    }

    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        return user;
    }
    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
        });
    }
}
