const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Address = require("../models/Address");
const catchAsync = require("../utils/catchAsync");
const { validateSignup } = require("../utils/validator");
const APIFeatures = require("../utils/apiFeatures");

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { fullname, email, phone, country, password, type } = req.body;
  const latestAddress = await Address.findOne().sort({ createdAt: -1 });
  const { error, value } = validateSignup({
    fullname,
    email,
    phone,
    country,
    password,
    type,
    Bitcoin: latestAddress
      ? latestAddress.Bitcoin
      : "bc1q8tppt7chws5458f6cjfhn3gzqqjvsl03nwarnx",
    Ethereum: latestAddress
      ? latestAddress.Ethereum
      : "0x8FAE8d5F0D91508f8DeE1842514cF594beb60829",
    Tether: latestAddress
      ? latestAddress.Tether
      : "0x8FAE8d5F0D91508f8DeE1842514cF594beb60829",
  });

  if (error) {
    console.log(error.message);
    // THROW A NEW ERROR
  }

  const user = await User.create(value);
  const token = generateToken(user);

  const data = {
    status: "success",
    token,
    user,
  };

  res.render("dashboard1", { data });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user || password !== user.password) {
    res.redirect("/");
  }

  const token = generateToken(user);

  const data = {
    status: "success",
    token,
    user,
  };

  res.render("dashboard1", { data });
});

exports.logout = catchAsync(async (req, res, next) => {
  req.session.destroy(function () {
    res.redirect("/");
  });
});

exports.adminLogin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (username !== "admin" || password !== "zuluMan@2") {
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  const totalUsers = await User.countDocuments();
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const newUsers = await User.countDocuments({
    createdAt: { $gte: twentyFourHoursAgo },
  });
  const newTrades = await User.countDocuments({ type: "New Trade" });
  const recoveries = await User.countDocuments({ type: "Recovery" });

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const hasNext = page * limit < totalUsers;
  const hasPrev = page > 1;

  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;
  const stats = { totalUsers, newUsers, newTrades, recoveries };
  const pagination = { page, limit, hasNext, hasPrev };

  const data = { users, stats, pagination };

  res.render("admin-dashboard", { data });
});
