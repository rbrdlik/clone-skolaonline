const router = require("express").Router();
const scheduleCtrl = require("../controllers/schedule");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/class/:classId", auth, scheduleCtrl.getScheduleByClass);
router.post("/", auth, role("admin", "učitel"), scheduleCtrl.createSchedule);
router.put("/:id", auth, role("admin", "učitel"), scheduleCtrl.updateSchedule);
router.delete("/:id", auth, role("admin", "učitel"), scheduleCtrl.deleteSchedule);

router.put("/:id/lesson", auth, role("admin", "učitel"), scheduleCtrl.updateLesson);
router.delete("/:id/lesson", auth, role("admin", "učitel"), scheduleCtrl.deleteLesson);

module.exports = router;
