const User = require("../models/User");
const Address = require("../models/Address");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

module.exports.home = (req, res, next) => {
  res.render("admin-login");
};

module.exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = {
    user,
  };
  res.render("admin-user-page", { data });
});

module.exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  user.save();

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

module.exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports.createUser = catchAsync(async (req, res, next) => {
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
    console.log(error.message);
    // THROW A NEW ERROR
  }

  const user = await User.create(value);
  // Handle response or error here

  res.status(201);
});

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
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

  // res.status(200).json({
  //   status: "success",
  //   results: users.length,
  //   data: { users },
  // });
});

module.exports.addresses = catchAsync(async (req, res, next) => {
  const latestAddress = await Address.findOne().sort({ createdAt: -1 });
  const data = {
    address: latestAddress,
  };
  console.log(data);
  res.render("deposit-addresses", { data });
});

module.exports.updateAddress = catchAsync(async (req, res, next) => {
  const { Bitcoin, Ethereum, Tether } = req.body;

  // Choose the field to update based on the route parameter
  const fieldToUpdate = req.params.field; // Assuming you have a route parameter named 'field'

  // Check if there is any document in the collection
  const latestAddress = await Address.findOne().sort({ createdAt: -1 });

  if (latestAddress) {
    // Document exists, update the latest one
    latestAddress[fieldToUpdate] = req.body[fieldToUpdate];
    await latestAddress.save();
    res.status(200).json({
      status: "success",
      message: `${fieldToUpdate} updated successfully.`,
    });
  } else {
    // No document exists, create a new one
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
