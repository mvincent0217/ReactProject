import { Request, Response, default as express } from "express";
import { getUserReservations, reserveFood } from "../controllers/orderController";

const router = express.Router();

router.post("/reserve", reserveFood)
router.get("/getuserreservations", getUserReservations)

export default router;
