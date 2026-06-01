const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Verify the user's httpOnly JWT cookie and attach req.user.
// On any failure, send the visitor back to the landing page.
module.exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.redirect("/");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.redirect("/");
  }

  const user = await User.findById(decoded.userId);
  if (!user) return res.redirect("/");

  req.user = user;
  next();
});

// Allow access only to the owning user (admins use the admin panel instead).
module.exports.ensureSelf = (req, res, next) => {
  if (!req.user || req.params.id !== req.user.id) {
    return next(new AppError("You are not allowed to access this resource.", 403));
  }
  next();
};

// Verify the signed admin cookie; otherwise bounce to the admin login page.
module.exports.adminProtect = (req, res, next) => {
  const token = req.cookies && req.cookies.adminToken;
  if (!token) return res.redirect(res.locals.adminPath || "/");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") throw new Error("not admin");
  } catch (err) {
    return res.redirect(res.locals.adminPath || "/");
  }
  next();
};
