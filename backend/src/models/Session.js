const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: String, required: true },
    // userAgent: { type: String },
    // ipAddress: { type: String },
    isActive: { type: Boolean, default: true },
    lastlastActive: { type: Date, default: Date.now },
    revokedReason: { type: String, default: null },
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

module.exports = mongoose.model("Session", sessionSchema);
