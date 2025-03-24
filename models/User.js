const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: (value) =>
          /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value),
        message: "Invalid email format",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    profilePic: {
      type: String,
      default: "/assets/images/default-user.jpeg",
    },
    imageId: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
    },
    signals: {
      type: String,
      default: "STANDARD",
    },
    plan: {
      type: String,
      default: "Starter Plan",
    },
    tradeStatus: {
      type: String,
      default: "pending",
    },
    username: {
      type: String,
      default: "user-z32",
    },
    note: {
      type: String,
      default:
        "Welcome to your live trading dashboard! Activate your trade using your unique trade address if you haven't done so already.",
    },
    walletAddress: String,
    profit: { type: Number, default: 0.0 },
    capital: { type: Number, default: 0.0 },
    bonus: { type: Number, default: 0.0 },
    totalRevenue: { type: Number, default: 0.0 },
    autoPilot: { type: Boolean, default: true },
    adaptiveLearning: Boolean,
    riskManagement: Boolean,
    Bitcoin: String,
    Ethereum: String,
    Tether: String,
  },
  { timestamps: true }
);

// Pre-save hook to calculate totalRevenue
userSchema.pre("save", function (next) {
  // Calculate totalRevenue as bonus + profit
  this.totalRevenue = this.bonus + this.profit;
  this.username = this.fullname.split(" ")[0];
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
