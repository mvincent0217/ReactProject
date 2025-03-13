import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    user?: { userId: number; fullName: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    console.log(req.cookies)
    const token = req.cookies["token"];
    console.log(token)

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; fullName: string };
        req.user = decoded;
        next(); // ✅ Must explicitly call `next()` here
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;
