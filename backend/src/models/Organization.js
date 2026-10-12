import mongoose from "mongoose";
const organizationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true }, contactPerson: { type: String, required: true }, phone: String, city: String, mission: String,
  documents: [{ url: String, filename: String }], walletAddress: { type: String, lowercase: true }, status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, verifiedAt: Date
}, { timestamps: true });
export default mongoose.model("Organization", organizationSchema);
