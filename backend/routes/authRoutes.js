const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  microsoftDemoSignup,
  microsoftDemoLogin,
  adminLogin
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/microsoft-demo-signup", microsoftDemoSignup);
router.post("/microsoft-demo-login", microsoftDemoLogin);
router.post("/admin-login", adminLogin);

module.exports = router;