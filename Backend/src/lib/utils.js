import jwt from "jsonwebtoken";

export const generateToken = (username, res) => {
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in ms
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};