const CoinGecko = require("coingecko-api");
const { uploadFromBuffer, deleteImage } = require("../utils/cloudinary");
const User = require("../models/User");
const Deposit = require("../models/Deposit");
const WithdrawalRequest = require("../models/WithdrawalRequest");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.home = (req, res, next) => {
  res.render("home");
};

exports.getUser = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    User.findById(req.params.id),
    req.query
  ).limitFields();
  const user = await features.query;

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.updateDP = catchAsync(async (req, res, next) => {
  // Check if a file is uploaded
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "Please upload an image.",
    });
  }
  const user = await User.findById(req.params.id);
  let prevImageId;
  if (user.imageId) {
    prevImageId = user.imageId;
  }
  // Upload image to Cloudinary
  const result = await uploadFromBuffer(req.file);
  // Update the user with the Cloudinary URL
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { profilePic: result.secure_url, imageId: result.public_id },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
  if (prevImageId) {
    await deleteImage(prevImageId);
  }
});

exports.dashboard = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || password !== user.password) {
    return res.status(401).json({
      status: "fail",
    });
  }

  res.status(200).json({
    status: "success",
  });
});

exports.deposit = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = {
    user,
  };
  res.render("deposit", { data });
});

exports.withdrawal = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = {
    user,
  };
  res.render("withdrawal", { data });
});

exports.profile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = {
    user,
  };
  res.render("user-profile", { data });
});

exports.settings = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = {
    user,
  };
  res.render("settings", { data });
});

exports.getCurrentPrice = catchAsync(async (req, res, next) => {
  const CoinGeckoClient = new CoinGecko();
  const data = await CoinGeckoClient.exchanges.fetchTickers("bitfinex", {
    coin_ids: ["bitcoin", "ethereum", "ripple", "litecoin", "stellar"],
  });

  const _coinList = {};
  const _datacc = data.data.tickers.filter((t) => t.target == "USD");

  ["BTC", "ETH", "XRP", "LTC", "XLM"].forEach((i) => {
    const _temp = _datacc.filter((t) => t.base == i);
    const _res = _temp.length == 0 ? [] : _temp[0];
    _coinList[i] = _res.last;
  });

  res.status(200).json({
    data: _coinList,
  });
});

// Submit a deposit proof-of-payment screenshot (creates a pending Deposit).
exports.submitProofOfPayment = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload a proof of payment image.", 400));
  }

  const result = await uploadFromBuffer(req.file);

  const deposit = await Deposit.create({
    user: req.params.id,
    method: req.body.method || "Wallet",
    amount: req.body.amount ? Number(req.body.amount) : 0,
    proofUrl: result.secure_url,
    proofId: result.public_id,
  });

  res.status(201).json({
    status: "success",
    data: { deposit },
  });
});

// Submit a withdrawal request (BTC or bank). Stored as pending for admin review.
exports.submitWithdrawalRequest = catchAsync(async (req, res, next) => {
  const { method, amount, ...destination } = req.body;

  if (method !== "btc" && method !== "bank") {
    return next(new AppError("Invalid withdrawal method.", 400));
  }

  const request = await WithdrawalRequest.create({
    user: req.params.id,
    method,
    amount: amount ? Number(amount) : 0,
    destination,
  });

  res.status(201).json({
    status: "success",
    data: { request },
  });
});
