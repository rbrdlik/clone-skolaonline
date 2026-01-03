const router = require("express").Router();
const scheduleChangesCtrl = require("../controllers/scheduleChanges");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/class/:classId/date/:date", auth, scheduleChangesCtrl.getChangesByClassAndDate);
router.post("/", auth, role("admin", "učitel"), scheduleChangesCtrl.createScheduleChange);
router.put("/:id", auth, role("admin", "učitel"), scheduleChangesCtrl.updateScheduleChange);
router.delete("/:id", auth, role("admin", "učitel"), scheduleChangesCtrl.deleteScheduleChange);

module.exports = router;
