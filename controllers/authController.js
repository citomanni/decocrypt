const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Address = require("../models/Address");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { validateSignup } = require("../utils/validator");
const { buildDashboardData } = require("../utils/dashboardData");

// Fallback deposit addresses used when no Address document exists yet.
const DEFAULT_ADDRESSES = {
  Bitcoin: "bc1q8tppt7chws5458f6cjfhn3gzqqjvsl03nwarnx",
  Ethereum: "0x8FAE8d5F0D91508f8DeE1842514cF594beb60829",
  Tether: "0x8FAE8d5F0D91508f8DeE1842514cF594beb60829",
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Store the auth token in an httpOnly cookie so it travels with page navigations.
const setAuthCookie = (res, token) => {
  res.cookie("token", token, { httpOnly: true, maxAge: ONE_DAY_MS });
};

exports.register = catchAsync(async (req, res, next) => {
  const { fullname, email, phone, country, password, type } = req.body;

  const { error, value } = validateSignup({
    fullname,
    email,
    phone,
    country,
    password,
    type,
  });

  if (error) {
    return next(new AppError(error.message, 400));
  }

  const latestAddress = await Address.findOne().sort({ createdAt: -1 });
  const user = await User.create({
    ...value,
    Bitcoin: latestAddress ? latestAddress.Bitcoin : DEFAULT_ADDRESSES.Bitcoin,
    Ethereum: latestAddress
      ? latestAddress.Ethereum
      : DEFAULT_ADDRESSES.Ethereum,
    Tether: latestAddress ? latestAddress.Tether : DEFAULT_ADDRESSES.Tether,
  });

  const token = generateToken(user);
  setAuthCookie(res, token);

  const data = {
    status: "success",
    token,
    user,
  };

  res.render("dashboard1", { data });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || password !== user.password) {
    return res.redirect("/");
  }

  const token = generateToken(user);
  setAuthCookie(res, token);

  const data = {
    status: "success",
    token,
    user,
  };

  res.render("dashboard1", { data });
});

exports.logout = catchAsync(async (req, res, next) => {
  // Clear both user and admin cookies, then return to the landing page.
  res.clearCookie("token");
  res.clearCookie("adminToken");
  res.redirect("/");
});

exports.adminLogin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  const adminToken = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("adminToken", adminToken, { httpOnly: true, maxAge: ONE_DAY_MS });

  const data = await buildDashboardData(req);

  res.render("admin-dashboard", { data });
});
