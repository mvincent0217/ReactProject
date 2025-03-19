import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql, poolPromise } from "../config/dbConfig";

const SECRET_KEY = process.env.JWT_SECRET as string;

export const reserveFood = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_fullname, food_id } = req.body;

        if (!user_fullname || !food_id) {
            res.status(400).json({ message: "User full name and food ID are required" });
            return
        }
        console.log("reserve CLick")
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("user_fullname", user_fullname)
            .input("food_id", food_id)
            .input("reservation_time", new Date())
            .query(`
                INSERT INTO reservations (user_fullname, food_id, reservation_time) 
                VALUES (@user_fullname, @food_id, @reservation_time)
            `);

        res.status(201).json({ message: "Reservation successful" });
    } catch (error) {
        console.error("Error reserving food:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserReservations = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_fullname } = req.query; // Get the user's name from query params

        if (!user_fullname) {
            res.status(400).json({ message: "User full name is required" });
            return
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("user_fullname", user_fullname)
            .query(`
                SELECT r.id, r.user_fullname, f.name AS food_name, r.reservation_time 
                FROM reservations r 
                JOIN foods f ON r.food_id = f.id
                WHERE r.user_fullname = @user_fullname
                ORDER BY r.reservation_time DESC
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ message: "Server error" });
    }
};