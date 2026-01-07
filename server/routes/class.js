const router = require("express").Router();
const classCtrl = require("../controllers/class");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/", auth, classCtrl.getAllClasses);
router.get("/:id", auth, classCtrl.getClassById);
router.post("/", auth, role("admin"), classCtrl.createClass);
router.put("/:id", auth, role("admin"), classCtrl.updateClass);
router.delete("/:id", auth, role("admin"), classCtrl.deleteClass);

router.post("/:id/add-student", auth, role("admin", "učitel"), classCtrl.addStudentToClass);
router.post("/:id/remove-student", auth, role("admin", "učitel"), classCtrl.removeStudentFromClass);
router.get("/:id/students", auth, classCtrl.getClassStudents);

module.exports = router;
