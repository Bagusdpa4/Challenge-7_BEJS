const router = require("express").Router();
const {
  register,
  login,
  auth,
  index,
  forgetPass,
  resetPass,
  pageLogin,
  pageForgetPass,
  pageResetPass,
  pageNotification,
} = require("../controllers/user.controllers");
const restrict = require("../middlewares/auth.middlewares");

// API Users
router.get("/users", index);

// API Auth
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/authenticate", restrict, auth);

// API Render Page Ejs
router.get("/login", pageLogin);
router.get("/forget-pass", pageForgetPass);
router.get("/reset-pass", pageResetPass);
router.get("/notification", pageNotification)

// API Forget Password Email
router.post("/forget-pass", forgetPass);
router.post("/reset-pass", resetPass);

module.exports = router;