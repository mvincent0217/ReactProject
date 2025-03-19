import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql, poolPromise } from "../config/dbConfig";

const SECRET_KEY = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, password, address } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = await poolPromise;
        await pool.request()
            .input("fullName", sql.NVarChar, fullName)
            .input("email", sql.NVarChar, email)
            .input("password", sql.NVarChar, hashedPassword)
            .input("address", sql.NVarChar, address)
            .query(`
                INSERT INTO Users (fullName, email, password, address)
                VALUES (@fullName, @email, @password, @address)
            `);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("userId", sql.Int, (req as any).user!.userId)
            .query(`SELECT fullName, email, role FROM Users WHERE id = @userId`);

        res.status(200).json(result.recordset[0]);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
        return
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("email", sql.NVarChar, email)
            .query("SELECT * FROM Users WHERE email = @email");

        if (result.recordset.length === 0) {
            res.status(401).json({ message: "Invalid credentials" });
            return
        }

        const user = result.recordset[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", user: { fullName: user.fullName }, token });
        return
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
        return
    }
};

export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};