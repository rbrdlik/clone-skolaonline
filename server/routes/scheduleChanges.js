const router = require("express").Router();
const scheduleChangesCtrl = require("../controllers/scheduleChanges");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/", auth, scheduleChangesCtrl.getScheduleChangesByClassAndDate);
router.post("/", auth, role("admin", "učitel"), scheduleChangesCtrl.createScheduleChange);
router.delete("/hour", auth, role("admin", "učitel"), scheduleChangesCtrl.deleteScheduleChangeHour);
router.delete("/day", auth, role("admin", "učitel"), scheduleChangesCtrl.deleteScheduleChangeDay);


module.exports = router;
