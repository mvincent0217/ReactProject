import { Request, Response, default as express } from "express";
import { getFoodItems, getUserReservations, reserveFood } from "../controllers/orderController";

const router = express.Router();

router.get("/getfooditems", getFoodItems)
router.post("/reserve", reserveFood)
router.get("/getuserreservations", getUserReservations)

export default router;
