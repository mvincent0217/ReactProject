import { Request, Response } from "express";
import sql from "mssql";
import { poolPromise } from "../config/dbConfig";

export const addFoods = async (req: Request, res: Response): Promise<void> => {
    try {
        const { names } = req.body;

        if (!Array.isArray(names) || names.length === 0) {
            res.status(400).json({ message: "Food names are required" });
            return;
        }

        const pool = await poolPromise;
        const transaction = await pool.transaction();

        await transaction.begin();

        const request = transaction.request();

        const values = names.map((_, index) => `(@food_name${index})`).join(",");
        names.forEach((name, index) => {
            request.input(`food_name${index}`, sql.NVarChar, name);
        });

        try {
            await request.query(`INSERT INTO foods (name) VALUES ${values}`);
            await transaction.commit();
            res.status(201).json({ message: "Foods added successfully" });
        } catch (queryError) {
            await transaction.rollback();
            console.error("SQL Query Error:", queryError);
            res.status(500).json({ message: "Database error", error: queryError });
        }
    } catch (error) {
        console.error("General Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const getFoodItems = async (req: Request, res: Response) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT id, name FROM foods");
        console.log(result)
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ message: "Server error" });
    }
};