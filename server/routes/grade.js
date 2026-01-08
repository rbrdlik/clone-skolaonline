const router = require("express").Router();
const gradeCtrl = require("../controllers/grade");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/student/:studentId/summary", gradeCtrl.getStudentGradesSummary);
router.get("/student/:studentId/all", gradeCtrl.getAllStudentGrades);
router.get(
  "/student/:studentId/subject/:subjectId",
  gradeCtrl.getStudentGradesBySubject
);
router.get("/check", gradeCtrl.checkGradesForLesson);
router.post("/bulk", gradeCtrl.createGradesBulk);
router.put("/:id", auth, role("admin", "učitel"), gradeCtrl.updateGrade);
router.delete("/:id", auth, role("admin", "učitel"), gradeCtrl.deleteGrade);


module.exports = router;
