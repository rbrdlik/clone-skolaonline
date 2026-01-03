const router = require("express").Router();
const groupCtrl = require("../controllers/group");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/class/:classId", auth, groupCtrl.getGroupsByClass);
router.get("/:id", auth, groupCtrl.getGroupById);
router.post("/", auth, role("admin", "učitel"), groupCtrl.createGroup);
router.put("/:id", auth, role("admin", "učitel"), groupCtrl.updateGroup);
router.delete("/:id", auth, role("admin", "učitel"), groupCtrl.deleteGroup);

router.post("/:id/add-student", auth, role("admin", "učitel"), groupCtrl.addStudentToGroup);
router.post("/:id/remove-student", auth, role("admin", "učitel"), groupCtrl.removeStudentFromGroup);

module.exports = router;
