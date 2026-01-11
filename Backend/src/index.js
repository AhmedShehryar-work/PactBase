import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"

import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import pactRoutes from "./routes/pact.route.js";
import userRoutes from "./routes/user.route.js"

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true, // start with Helmet defaults
      directives: {
        "default-src": ["'self'"],         // allow resources only from your own domain
        "script-src": ["'self'"],          // only allow JS from your server/bundle
        "style-src": ["'self'", "'unsafe-inline'"], // allow CSS from your server; inline styles if needed
        "img-src": ["'self'", "data:"],    // allow images from server + base64 images
        "connect-src": ["'self'", "http://localhost:4000"], // allow API calls to your backend
        "font-src": ["'self'"],             // allow fonts from your server
        "object-src": ["'none'"],           // disable object/embed tags
        "frame-ancestors": ["'none'"],     // prevent clickjacking
      },
    },
  }));
  
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/pact", pactRoutes);
app.use("/api/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
});
