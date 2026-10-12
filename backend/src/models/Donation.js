import mongoose from "mongoose";
const donationSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true }, donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  donorWallet: String, organizationWallet: String, amountWei: { type: String, required: true }, transactionHash: { type: String, required: true, unique: true }, blockNumber: Number
}, { timestamps: true });
export default mongoose.model("Donation", donationSchema);
