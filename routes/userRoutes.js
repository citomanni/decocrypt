const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const recoveryController = require("../controllers/recoveryController");
const upload = require("../middleware/upload");
const { protect, ensureSelf } = require("../middleware/auth");

// Public
router.get("/", userController.home);
router.post("/register", authController.register);
router.post("/login", userController.dashboard);
router.post("/logout", authController.logout);
router.post("/dashboard", authController.login);
router.get("/currency-prices", userController.getCurrentPrice);

// Authenticated — a user may only act on their own record.
router
  .route("/users/:id")
  .get(protect, ensureSelf, userController.getUser)
  .put(protect, ensureSelf, userController.updateProfile);

router.put(
  "/users/:id/profile-picture",
  protect,
  ensureSelf,
  upload.single("profilePicture"),
  userController.updateDP
);

router.get("/users/:id/profile", protect, ensureSelf, userController.profile);
router.get("/users/:id/settings", protect, ensureSelf, userController.settings);
router.get("/users/:id/deposit", protect, ensureSelf, userController.deposit);
router.get(
  "/users/:id/withdrawal",
  protect,
  ensureSelf,
  userController.withdrawal
);

// Deposit proof-of-payment + withdrawal request
router.post(
  "/users/:id/proof-of-payment",
  protect,
  ensureSelf,
  upload.single("proof"),
  userController.submitProofOfPayment
);
router.post(
  "/users/:id/withdrawal-request",
  protect,
  ensureSelf,
  userController.submitWithdrawalRequest
);

// Recovery case
router.get(
  "/users/:id/recovery",
  protect,
  ensureSelf,
  recoveryController.getRecovery
);
router.post(
  "/users/:id/recovery",
  protect,
  ensureSelf,
  upload.single("evidence"),
  recoveryController.submitCase
);

module.exports = router;
