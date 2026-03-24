import cookie from "cookie";
import jwt from "jsonwebtoken";

export default function initSocket(io) {
  io.on("connection", (socket) => {

    try {

      const rawCookie = socket.request.headers.cookie;
      if (!rawCookie) throw new Error("No cookies found");

      const parsed = cookie.parse(rawCookie);

      const token = parsed.jwt;
      if (!token) throw new Error("No jwt-token in cookie");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) throw new Error("Invalid jwt-token in cookie");
      
      const username = decoded.username;

      socket.join(username);
      socket.data.username = username;

    } catch (err) {
      socket.emit("auth_error", { message: err.message });
      socket.disconnect(true);
      return;
    }

  });
}

/* ================= NOTIFICATIONS ================= */

export const notifyUser = (io, username, type, data = {}) => {

  try{

    if (!username || !type) throw new Error("Error in username or type");

    io.to(username).emit("notification", {
      type,
      data,
      createdAt: new Date().toISOString(),
    });

  }
  catch(err){
    socket.emit("notification_error", { message: err.message });
  }
};