import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"

import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
  console.log(`${process.env.DATABASE_URI} 1`);
});
