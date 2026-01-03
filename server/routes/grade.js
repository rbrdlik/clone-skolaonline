const router = require("express").Router();
const gradeCtrl = require("../controllers/grade");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.post("/", auth, role("admin", "učitel"), gradeCtrl.createGrade);
router.put("/:id", auth, role("admin", "učitel"), gradeCtrl.updateGrade);
router.delete("/:id", auth, role("admin", "učitel"), gradeCtrl.deleteGrade);

router.get("/student/:studentId", auth, gradeCtrl.getGradesByStudent);
router.get("/class/:classId", auth, gradeCtrl.getGradesByClass);
router.get("/subject/:subjectId", auth, gradeCtrl.getGradesBySubject);
router.get("/student/:studentId/average", auth, gradeCtrl.getStudentAverage);

module.exports = router;
