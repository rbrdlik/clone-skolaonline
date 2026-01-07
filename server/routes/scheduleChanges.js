const router = require("express").Router();
const scheduleChangesCtrl = require("../controllers/scheduleChanges");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.post("/", scheduleChangesCtrl.createScheduleChange);
router.delete("/hour", scheduleChangesCtrl.deleteScheduleChangeHour);
router.delete("/day", scheduleChangesCtrl.deleteScheduleChangeDay);


module.exports = router;
