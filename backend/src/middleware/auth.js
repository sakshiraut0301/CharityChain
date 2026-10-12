import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function protect(req, res, next) {
  try { const token = req.headers.authorization?.replace("Bearer ", ""); if (!token) return res.status(401).json({ message: "Authentication required" }); const { id } = jwt.verify(token, process.env.JWT_SECRET); req.user = await User.findById(id); if (!req.user) return res.status(401).json({ message: "Account no longer exists" }); next(); } catch { res.status(401).json({ message: "Invalid or expired token" }); }
}
export const allow = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: "Insufficient permission" });
