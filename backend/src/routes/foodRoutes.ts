import express from "express";
import { addFoods, getFoodItems } from "../controllers/foodController";

const router = express.Router();

// Route to add multiple foods
router.post("/add", addFoods);
router.get("/getfooditems", getFoodItems)

export default router;
