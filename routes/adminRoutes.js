const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

router.get("/", adminController.home);
router.post("/", authController.adminLogin);
router.get("/users", adminController.getAllUsers);

router
  .route("/users/:id")
  .get(adminController.getUser)
  .put(adminController.updateUser)
  .delete(adminController.deleteUser);

router.get("/addresses", adminController.addresses);
router.post("/addresses/:field", adminController.updateAddress);

module.exports = router;
