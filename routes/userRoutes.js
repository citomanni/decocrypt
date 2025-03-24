const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const upload = require("../middleware/upload");

router.get("/", userController.home);
router.get("/users", adminController.getAllUsers);
router
  .route("/users/:id")
  .get(userController.getUser)
  .put(userController.updateProfile)
  .delete(adminController.deleteUser);

router.put(
  "/users/:id/profile-picture",
  upload.single("profilePicture"),
  userController.updateDP
);
router.get("/users/:id/profile", userController.profile);
router.get("/users/:id/settings", userController.settings);
router.get("/users/:id/deposit", userController.deposit);
router.get("/users/:id/withdrawal", userController.withdrawal);

router.post("/register", authController.register);
router.post("/login", userController.dashboard);
router.post("/logout", authController.logout);
router.post("/dashboard", authController.login);
router.get("/currency-prices", userController.getCurrentPrice);

module.exports = router;
