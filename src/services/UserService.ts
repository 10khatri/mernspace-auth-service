import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        try {
            const newUser = await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
                role: "customer",
            });
            return newUser;
        } catch (error) {
            const err = createHttpError(500, "failed to store data in db");
            throw err;
        }
    }
}
