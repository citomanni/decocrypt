const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Address = require("../models/Address");
const Deposit = require("../models/Deposit");
const WithdrawalRequest = require("../models/WithdrawalRequest");
const RecoveryCase = require("../models/RecoveryCase");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { validateSignup } = require("../utils/validator");
const { buildDashboardData } = require("../utils/dashboardData");

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

exports.home = (req, res, next) => {
  res.render("admin-login");
};

exports.logout = (req, res, next) => {
  res.clearCookie("adminToken");
  res.redirect(res.locals.adminPath || "/");
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = {
    user,
  };
  res.render("admin-user-page", { data });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await user.save();

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
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

  const user = await User.create(value);

  res.status(201).json({
    status: "success",
    data: { user },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const data = await buildDashboardData(req);
  res.render("admin-dashboard", { data });
});

// "View as user": log in AS the user (sets the user token cookie) and open
// their dashboard. The adminToken cookie is untouched, so the admin stays
// authenticated for the panel.
exports.impersonate = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found.", 404));

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token, { httpOnly: true, maxAge: ONE_DAY_MS });

  res.render("dashboard1", { data: { status: "success", token, user } });
});

exports.addresses = catchAsync(async (req, res, next) => {
  const latestAddress = await Address.findOne().sort({ createdAt: -1 });
  const data = {
    address: latestAddress,
  };
  res.render("deposit-addresses", { data });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  // The field to update (Bitcoin/Ethereum/Tether) comes from the route param.
  const fieldToUpdate = req.params.field;

  const latestAddress = await Address.findOne().sort({ createdAt: -1 });

  if (latestAddress) {
    latestAddress[fieldToUpdate] = req.body[fieldToUpdate];
    await latestAddress.save();
    res.status(200).json({
      status: "success",
      message: `${fieldToUpdate} updated successfully.`,
    });
  } else {
    const newAddress = new Address({
      [fieldToUpdate]: req.body[fieldToUpdate],
    });
    await newAddress.save();
    res.status(201).json({
      status: "success",
      message: `${fieldToUpdate} created successfully.`,
    });
  }
});

// ---- Deposits queue ----
exports.deposits = catchAsync(async (req, res, next) => {
  const deposits = await Deposit.find()
    .populate("user", "fullname email")
    .sort({ createdAt: -1 });
  res.render("admin-deposits", { data: { deposits } });
});

exports.updateDeposit = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const deposit = await Deposit.findById(req.params.id);
  if (!deposit) return next(new AppError("Deposit not found.", 404));

  // Credit the user's capital once, only when moving into the approved state.
  if (status === "approved" && deposit.status !== "approved" && deposit.amount) {
    await User.findByIdAndUpdate(deposit.user, {
      $inc: { capital: deposit.amount },
    });
  }

  deposit.status = status;
  await deposit.save();

  res.status(200).json({ status: "success", data: { deposit } });
});

// ---- Withdrawals queue ----
exports.withdrawals = catchAsync(async (req, res, next) => {
  const withdrawals = await WithdrawalRequest.find()
    .populate("user", "fullname email")
    .sort({ createdAt: -1 });
  res.render("admin-withdrawals", { data: { withdrawals } });
});

exports.updateWithdrawal = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const request = await WithdrawalRequest.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!request) return next(new AppError("Withdrawal request not found.", 404));

  res.status(200).json({ status: "success", data: { request } });
});

// ---- Recovery cases board ----
exports.cases = catchAsync(async (req, res, next) => {
  const cases = await RecoveryCase.find()
    .populate("user", "fullname email")
    .sort({ createdAt: -1 });
  res.render("admin-cases", { data: { cases } });
});

exports.updateCase = catchAsync(async (req, res, next) => {
  const { status, progress, adminNotes } = req.body;
  const recoveryCase = await RecoveryCase.findByIdAndUpdate(
    req.params.id,
    {
      ...(status !== undefined && { status }),
      ...(progress !== undefined && { progress: Number(progress) }),
      ...(adminNotes !== undefined && { adminNotes }),
    },
    { new: true, runValidators: true }
  );
  if (!recoveryCase) return next(new AppError("Case not found.", 404));

  res.status(200).json({ status: "success", data: { case: recoveryCase } });
});
