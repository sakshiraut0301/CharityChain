import mongoose from "mongoose";
const utilizationUpdateSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true }, title: { type: String, required: true }, detail: { type: String, required: true },
  amountUsed: { type: Number, min: 0 }, proofFiles: [{ url: String, filename: String }]
}, { timestamps: true });
export default mongoose.model("UtilizationUpdate", utilizationUpdateSchema);
