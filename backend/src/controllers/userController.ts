import { Request, Response } from "express";
import { sql, poolPromise } from "../config/dbConfig";
import { AuthRequest } from "../types/express";

export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("userId", sql.Int, req.user.id)
            .query("SELECT * FROM Users WHERE id = @userId");

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
