import express from "express";
import Organization from "../models/Organization.js";
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import { allow, protect } from "../middleware/auth.js";
const router = express.Router();
router.get("/analytics", protect, allow("admin"), async (_req, res, next) => { try { const [organizations, campaigns, donations] = await Promise.all([Organization.countDocuments({ status: "approved" }), Campaign.countDocuments(), Donation.countDocuments()]); const campaignPerformance = await Donation.aggregate([{ $group: { _id: "$campaign", donations: { $sum: 1 }, totalWei: { $sum: { $toDecimal: "$amountWei" } } } }]); res.json({ organizations, campaigns, donations, campaignPerformance }); } catch (error) { next(error); } });
export default router;
