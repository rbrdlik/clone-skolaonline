const router = require("express").Router();
const messageCtrl = require("../controllers/message");
const auth = require("../middlewares/auth");

router.post("/", auth, messageCtrl.sendMessage);
router.get("/inbox/:userId", auth, messageCtrl.getInbox);
router.get("/sent/:userId", auth, messageCtrl.getSentMessages);
router.get("/:id", auth, messageCtrl.getMessageById);
router.delete("/:id", auth, messageCtrl.deleteMessage);

module.exports = router;
