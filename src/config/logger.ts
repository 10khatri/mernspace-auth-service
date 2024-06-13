import winston from "winston";
import { Config } from ".";

const logger = winston.createLogger({
    level: "info",
    defaultMeta: {
        service: "auth-service",
    },
    transports: [
        new winston.transports.File({
            filename: "combine.log",
            dirname: "logs",
            level: "info",
            silent: Config.NODE_ENV === "test",
        }),
        new winston.transports.File({
            filename: "error.log",
            dirname: "logs",
            level: "error",
            silent: Config.NODE_ENV === "test",
        }),
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                winston.format.json(),
                winston.format.timestamp(),
            ),
            silent: Config.NODE_ENV === "test",
        }),
    ],
});

export default logger;
