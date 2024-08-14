import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import cookieParser from "cookie-parser";
import { HttpError } from "http-errors";
import cors from "cors";
import authRouter from "./routes/auth";
const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.get("/", async (req, res) => {
    res.send("Hello World");
});

app.use("/auth", authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                message: err.message,
                path: "",
                location: "",
            },
        ],
    });
});

export default app;
