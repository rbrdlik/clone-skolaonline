const router = require("express").Router();
const authCtrl = require("../controllers/auth");
const auth = require("../middlewares/auth");

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.post("/refresh", authCtrl.refreshToken);
router.post("/logout", authCtrl.logout);
router.get("/me", auth, authCtrl.me);

module.exports = router;
