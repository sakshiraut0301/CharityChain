import mongoose from "mongoose";
const campaignSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true }, title: { type: String, required: true }, description: { type: String, required: true },
  category: String, targetAmount: { type: Number, required: true, min: 1 }, raisedAmount: { type: Number, default: 0 }, deadline: { type: Date, required: true },
  proofFiles: [{ url: String, filename: String }], chainCampaignId: String, status: { type: String, enum: ["active", "closed"], default: "active" }
}, { timestamps: true });
export default mongoose.model("Campaign", campaignSchema);
