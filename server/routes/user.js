const router = require("express").Router();
const userCtrl = require("../controllers/user");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/", auth, role("admin"), userCtrl.getAllUsers);
router.get("/:id", auth, userCtrl.getUserById); 
router.post("/", auth, role("admin"), userCtrl.createUser); 
router.put("/:id", auth, role("admin"), userCtrl.updateUser); 
router.delete("/:id", auth, role("admin"), userCtrl.deleteUser);
router.get("/students", auth, role("admin", "učitel"), userCtrl.getAllStudents); 
router.get("/students/without-class", auth, role("admin"), userCtrl.getStudentsWithoutClass); 
router.get("/students/class/:classId", auth, role("admin", "učitel"), userCtrl.getStudentsByClass); 
router.get("/teachers", auth, role("admin"), userCtrl.getAllTeachers); 

module.exports = router;
