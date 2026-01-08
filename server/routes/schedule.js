const router = require("express").Router();
const scheduleCtrl = require("../controllers/schedule");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/student", scheduleCtrl.getStudentScheduleForDay);
router.get("/student/lesson-detail", scheduleCtrl.getStudentLessonDetail);
router.get("/teacher", scheduleCtrl.getTeacherScheduleForDay);
router.get("/class", scheduleCtrl.getClassScheduleForDay);

router.post("/", scheduleCtrl.createSchedule);
router.put("/:id", scheduleCtrl.updateSchedule);

module.exports = router;
