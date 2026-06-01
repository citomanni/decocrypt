const mongoose = require("mongoose");
const { Schema } = mongoose;

const withdrawalRequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    method: {
      type: String,
      enum: ["btc", "bank"],
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    // Holds the BTC address, or the bank fields, depending on method.
    destination: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WithdrawalRequest", withdrawalRequestSchema);
