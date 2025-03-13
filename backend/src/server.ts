import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import ordersRoutes from "./routes/ordersRoutes";
import foodRoutes from "./routes/foodRoutes";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/foods", foodRoutes)

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
