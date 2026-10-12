import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, role: { type: String, enum: ["donor", "organization", "admin"], default: "donor" },
  walletAddress: { type: String, lowercase: true }, organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }
}, { timestamps: true });
export default mongoose.model("User", userSchema);
