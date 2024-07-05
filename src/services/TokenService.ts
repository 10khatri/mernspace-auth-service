import { JwtPayload, sign } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import createHttpError from "http-errors";
import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer;
        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            );
        } catch (err) {
            const error = createHttpError(
                500,
                "error while reading private key",
            );
            throw error;
        }
        const accessToken = sign(payload, privateKey, {
            expiresIn: "1h",
            algorithm: "RS256",
            issuer: "auth-service",
        });
        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(
            payload,
            String(Config.REFRESH_TOKEN_SECRET),
            {
                algorithm: "HS256",
                expiresIn: "1y",
                issuer: "auth-service",
                jwtid: String(payload.jwtid),
            },
        );
        return refreshToken;
    }
    async persistRefreshToken(user: User) {
        const newRefreshToken = this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        });
        return newRefreshToken;
    }
}
