const mongoose = require("mongoose");
const { Schema } = mongoose;

const recoveryCaseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    asset: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    amountLost: {
      type: Number,
      default: 0,
    },
    dateLost: Date,
    scamType: String,
    description: String,
    evidenceUrl: String,
    evidenceId: String,
    status: {
      type: String,
      enum: ["submitted", "under_review", "in_progress", "recovered", "closed"],
      default: "submitted",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    adminNotes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecoveryCase", recoveryCaseSchema);
