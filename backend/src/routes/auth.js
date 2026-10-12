import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();
const tokenFor = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
router.post("/register", async (req, res, next) => { try { const { name, email, password, role = "donor" } = req.body; if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" }); if (await User.exists({ email })) return res.status(409).json({ message: "Email is already registered" }); const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role }); res.status(201).json({ token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } }); } catch (error) { next(error); } });
router.post("/login", async (req, res, next) => { try { const user = await User.findOne({ email: req.body.email?.toLowerCase() }); if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) return res.status(401).json({ message: "Incorrect email or password" }); res.json({ token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email, role: user.role, organizationId: user.organization } }); } catch (error) { next(error); } });
export default router;
