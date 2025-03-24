const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    Bitcoin: {
      type: String,
      default: "bc1q8tppt7chws5458f6cjfhn3gzqqjvsl03nwarnx",
    },
    Ethereum: {
      type: String,
      default: "0x8FAE8d5F0D91508f8DeE1842514cF594beb60829",
    },
    Tether: {
      type: String,
      default: "0x8FAE8d5F0D91508f8DeE1842514cF594beb60829",
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
