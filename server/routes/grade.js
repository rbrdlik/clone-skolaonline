const router = require("express").Router();
const gradeCtrl = require("../controllers/grade");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/student/:studentId/summary", gradeCtrl.getStudentGradesSummary);
router.get(
  "/student/:studentId/subject/:subjectId",
  gradeCtrl.getStudentGradesBySubject
);
router.post("/bulk", gradeCtrl.createGradesBulk);


module.exports = router;
