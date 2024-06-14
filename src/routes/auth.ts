import express from "express";
import { AuthController } from "../controllers/AuthController";
const router = express.Router();

const authController = new AuthController();

router.post("/register", async (req, res) => {
    await authController.register(req, res);
});

export default router;
