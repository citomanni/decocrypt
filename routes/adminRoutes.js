const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const { adminProtect } = require("../middleware/auth");

// Login page + submit (public).
router.get("/", adminController.home);
router.post("/", authController.adminLogin);

// Everything below requires a valid admin cookie.
router.use(adminProtect);

router.get("/logout", adminController.logout);

router.get("/users", adminController.getAllUsers);
router.post("/users", adminController.createUser);
router.get("/users/:id/impersonate", adminController.impersonate);

router
  .route("/users/:id")
  .get(adminController.getUser)
  .put(adminController.updateUser)
  .delete(adminController.deleteUser);

router.get("/addresses", adminController.addresses);
router.post("/addresses/:field", adminController.updateAddress);

// Operational queues
router.get("/deposits", adminController.deposits);
router.put("/deposits/:id", adminController.updateDeposit);

router.get("/withdrawals", adminController.withdrawals);
router.put("/withdrawals/:id", adminController.updateWithdrawal);

router.get("/cases", adminController.cases);
router.put("/cases/:id", adminController.updateCase);

module.exports = router;
