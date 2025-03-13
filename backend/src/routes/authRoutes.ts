import { Request, Response, default as express } from "express";
import { loginUser, register, getUser, logoutUser } from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", authMiddleware, getUser)

export default router;
