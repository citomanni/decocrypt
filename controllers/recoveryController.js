const User = require("../models/User");
const RecoveryCase = require("../models/RecoveryCase");
const catchAsync = require("../utils/catchAsync");
const { uploadFromBuffer } = require("../utils/cloudinary");

// Render the recovery page: shows the user's existing case (if any) or the
// submission form when none exists yet.
exports.getRecovery = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const recoveryCase = await RecoveryCase.findOne({ user: req.params.id }).sort(
    { createdAt: -1 }
  );

  res.render("recovery", { data: { user, case: recoveryCase } });
});

// Submit a new recovery case (with optional evidence upload).
exports.submitCase = catchAsync(async (req, res, next) => {
  const { asset, currency, amountLost, dateLost, scamType, description } =
    req.body;

  let evidenceUrl;
  let evidenceId;
  if (req.file) {
    const result = await uploadFromBuffer(req.file);
    evidenceUrl = result.secure_url;
    evidenceId = result.public_id;
  }

  await RecoveryCase.create({
    user: req.params.id,
    asset,
    currency,
    amountLost: amountLost ? Number(amountLost) : 0,
    dateLost: dateLost || undefined,
    scamType,
    description,
    evidenceUrl,
    evidenceId,
  });

  res.redirect(`/users/${req.params.id}/recovery`);
});
