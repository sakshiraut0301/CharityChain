import express from "express";
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.post("/record", protect, async (req, res, next) => { try { const { campaignId, donorWallet, organizationWallet, amountWei, transactionHash, blockNumber } = req.body; const campaign = await Campaign.findById(campaignId); if (!campaign) return res.status(404).json({ message: "Campaign not found" }); const donation = await Donation.create({ campaign: campaignId, donor: req.user._id, donorWallet, organizationWallet, amountWei, transactionHash, blockNumber }); res.status(201).json(donation); } catch (error) { if (error.code === 11000) return res.status(409).json({ message: "Transaction already recorded" }); next(error); } });
router.get("/mine", protect, async (req, res, next) => { try { res.json(await Donation.find({ donor: req.user._id }).populate("campaign", "title")); } catch (error) { next(error); } });
export default router;
