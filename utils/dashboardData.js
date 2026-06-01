const User = require("../models/User");
const Deposit = require("../models/Deposit");
const WithdrawalRequest = require("../models/WithdrawalRequest");
const RecoveryCase = require("../models/RecoveryCase");
const APIFeatures = require("./apiFeatures");

// Build a case-insensitive search filter across name, email and type.
// Returns {} when there is no search term so it matches all users.
const buildSearchFilter = (search) => {
  if (!search) return {};
  const escaped = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const regex = new RegExp(escaped, "i");
  return { $or: [{ fullname: regex }, { email: regex }, { type: regex }] };
};

// Assembles everything the admin dashboard view needs: top-line stats,
// the (optionally searched + paginated) user list, and pagination state.
// Shared by adminController.getAllUsers / search and authController.adminLogin.
module.exports.buildDashboardData = async (req) => {
  const search = (req.query.search || req.body.search || "").toString().trim();
  // Make the term available to APIFeatures.search() regardless of method.
  if (search) req.query.search = search;

  // Optional quick filters (handled generically by APIFeatures.filter() too).
  const type = (req.query.type || "").toString().trim();
  const tradeStatus = (req.query.tradeStatus || "").toString().trim();

  // Combined filter mirrors what APIFeatures applies, so the count is accurate.
  const matchFilter = { ...buildSearchFilter(search) };
  if (type) matchFilter.type = type;
  if (tradeStatus) matchFilter.tradeStatus = tradeStatus;

  const totalUsers = await User.countDocuments();
  // Pagination must reflect the filtered result set, not the whole collection.
  const matchedUsers =
    search || type || tradeStatus
      ? await User.countDocuments(matchFilter)
      : totalUsers;

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const newUsers = await User.countDocuments({
    createdAt: { $gte: twentyFourHoursAgo },
  });
  const newTrades = await User.countDocuments({ type: "New Trade" });
  const recoveries = await User.countDocuments({ type: "Recovery" });

  // Pending operational items (drive the sidebar badges).
  const pendingDeposits = await Deposit.countDocuments({ status: "pending" });
  const pendingWithdrawals = await WithdrawalRequest.countDocuments({
    status: "pending",
  });
  const pendingCases = await RecoveryCase.countDocuments({
    status: { $in: ["submitted", "under_review", "in_progress"] },
  });

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const hasNext = page * limit < matchedUsers;
  const hasPrev = page > 1;

  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;

  return {
    users,
    stats: {
      totalUsers,
      newUsers,
      newTrades,
      recoveries,
      pendingDeposits,
      pendingWithdrawals,
      pendingCases,
    },
    pagination: { page, limit, hasNext, hasPrev, search, type, tradeStatus },
  };
};

module.exports.buildSearchFilter = buildSearchFilter;
