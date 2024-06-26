import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
// import createHttpError from "http-errors";
import { validationResult } from "express-validator";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;

        this.logger.debug("new request to register user", {
            email,
            firstName,
            lastName,
            password: "*****",
        });

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });
            this.logger.info(`User with id ${user.id} created`);

            const accessToken = "eqwerqwq";
            const refreshToken = "dasdasda";
            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, //1 hr
                httpOnly: true,
            });
            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, //1 hr
                httpOnly: true,
            });

            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
