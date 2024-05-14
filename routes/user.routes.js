const router = require("express").Router();
const {register, login, auth, index } = require("../controllers/user.controllers");
const restrict = require('../middlewares/auth.middlewares')

// API Users
router.get("/users", index);

// API Auth
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/authenticate", restrict, auth);

module.exports = router;