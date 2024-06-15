import express from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { User } from "../entity/User";
import { AppDataSource } from "../config/data-source";
const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

router.post("/register", async (req, res) => {
    await authController.register(req, res);
});

export default router;
