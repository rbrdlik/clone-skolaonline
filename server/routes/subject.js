const router = require("express").Router();
const subjectCtrl = require("../controllers/subject");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/", auth, subjectCtrl.getAllSubjects);
router.get("/:id", auth, subjectCtrl.getSubjectById);
router.post("/", auth, role("admin"), subjectCtrl.createSubject);
router.put("/:id", auth, role("admin"), subjectCtrl.updateSubject);
router.delete("/:id", auth, role("admin"), subjectCtrl.deleteSubject);

router.post("/:id/assign-teacher", auth, role("admin"), subjectCtrl.assignTeacherToSubject);
router.post("/:id/remove-teacher", auth, role("admin"), subjectCtrl.removeTeacherFromSubject);

module.exports = router;
