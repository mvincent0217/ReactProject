import express from "express";
import { addFoods } from "../controllers/foodController";

const router = express.Router();

// Route to add multiple foods
router.post("/add", addFoods);

export default router;
