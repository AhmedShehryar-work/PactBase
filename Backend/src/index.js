import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import authRoutes from "./routes/auth.route.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
});
