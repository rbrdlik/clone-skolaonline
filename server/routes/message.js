const router = require("express").Router();
const messageCtrl = require("../controllers/message");
const auth = require("../middlewares/auth");

router.get("/student/:studentId", messageCtrl.getMessagesForStudent);
router.get("/:id", messageCtrl.getMessageDetail);
router.post("/", messageCtrl.createMessage);

module.exports = router;
