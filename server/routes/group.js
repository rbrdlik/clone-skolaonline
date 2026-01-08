const router = require("express").Router();
const groupCtrl = require("../controllers/group");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

/**
 * @openapi
 * /group/class/{classId}:
 *   get:
 *     summary: Získání všech skupin pro třídu
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skupiny nalezeny
 *       404:
 *         description: Skupiny nenalezeny
 */
router.get("/class/:classId", auth, groupCtrl.getGroupsByClass);

/**
 * @openapi
 * /group/{id}:
 *   get:
 *     summary: Získání skupiny podle ID
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skupina nalezena
 *       404:
 *         description: Skupina nenalezena
 */
router.get("/:id", auth, groupCtrl.getGroupById);

/**
 * @openapi
 * /group:
 *   post:
 *     summary: Vytvoření nové skupiny
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - class_id
 *             properties:
 *               name:
 *                 type: string
 *               class_id:
 *                 type: string
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Skupina vytvořena
 *       404:
 *         description: Skupina nebyla vytvořena
 */
router.post("/", auth, role("admin", "učitel"), groupCtrl.createGroup);

/**
 * @openapi
 * /group/{id}:
 *   put:
 *     summary: Úprava skupiny
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               class_id:
 *                 type: string
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Skupina upravena
 *       404:
 *         description: Skupina nebyla upravena
 */
router.put("/:id", auth, role("admin", "učitel"), groupCtrl.updateGroup);

/**
 * @openapi
 * /group/{id}:
 *   delete:
 *     summary: Smazání skupiny
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skupina smazána
 *       404:
 *         description: Skupina nenalezena
 */
router.delete("/:id", auth, role("admin", "učitel"), groupCtrl.deleteGroup);

/**
 * @openapi
 * /group/{id}/add-student:
 *   post:
 *     summary: Přidání studenta do skupiny
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student přidán do skupiny
 *       404:
 *         description: Skupina nenalezena
 */
router.post(
  "/:id/add-student",
  auth,
  role("admin", "učitel"),
  groupCtrl.addStudentToGroup
);

/**
 * @openapi
 * /group/{id}/remove-student:
 *   post:
 *     summary: Odebrání studenta ze skupiny
 *     tags:
 *       - Groups
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student odebrán ze skupiny
 *       404:
 *         description: Skupina nenalezena
 */
router.post(
  "/:id/remove-student",
  auth,
  role("admin", "učitel"),
  groupCtrl.removeStudentFromGroup
);

module.exports = router;
