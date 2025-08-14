import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

      const [user] = await Q`
      SELECT 
        id,
        full_name,
        email,
        profile_image,
        blocked_users,
        blocked_by,
        rating,
        pacts_fulfilled,
        created_at
      FROM users
      WHERE id = ${decoded.id}
      LIMIT 1
    `;
    req.user = user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};