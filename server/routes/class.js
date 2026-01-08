const router = require("express").Router();
const classCtrl = require("../controllers/class");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

/**
 * @openapi
 * /classes:
 *   get:
 *     summary: Získání všech tříd
 *     tags:
 *       - Classes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Třídy nalezeny
 *       404:
 *         description: Třídy nenalezeny
 */

router.get("/", auth, classCtrl.getAllClasses);
/**
 * @openapi
 * /classes/{id}:
 *   get:
 *     summary: Získání třídy podle ID
 *     tags:
 *       - Classes
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
 *         description: Třída nalezena
 *       404:
 *         description: Třída nenalezena
 */
router.get("/:id", auth, classCtrl.getClassById);

/**
 * @openapi
 * /classes:
 *   post:
 *     summary: Vytvoření nové třídy
 *     tags:
 *       - Classes
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
 *             properties:
 *               name:
 *                 type: string
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Třída vytvořena
 *       404:
 *         description: Třída nebyla vytvořena
 */
router.post("/", auth, role("admin"), classCtrl.createClass);

/**
 * @openapi
 * /classes/{id}:
 *   put:
 *     summary: Úprava třídy
 *     tags:
 *       - Classes
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
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Třída upravena
 *       404:
 *         description: Třída nebyla upravena
 */
router.put("/:id", auth, role("admin"), classCtrl.updateClass);

/**
 * @openapi
 * /classes/{id}:
 *   delete:
 *     summary: Smazání třídy
 *     tags:
 *       - Classes
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
 *         description: Třída smazána
 *       404:
 *         description: Třída nebyla smazána
 */
router.delete("/:id", auth, role("admin"), classCtrl.deleteClass);

/**
 * @openapi
 * /classes/{id}/add-student:
 *   post:
 *     summary: Přidání studenta do třídy
 *     tags:
 *       - Classes
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
 *         description: Student přidán
 *       404:
 *         description: Třída nenalezena
 */
router.post(
  "/:id/add-student",
  auth,
  role("admin", "učitel"),
  classCtrl.addStudentToClass
);

/**
 * @openapi
 * /classes/{id}/remove-student:
 *   post:
 *     summary: Odebrání studenta ze třídy
 *     tags:
 *       - Classes
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
 *         description: Student odebrán
 *       404:
 *         description: Třída nenalezena
 */
router.post(
  "/:id/remove-student",
  auth,
  role("admin", "učitel"),
  classCtrl.removeStudentFromClass
);

/**
 * @openapi
 * /classes/{id}/students:
 *   get:
 *     summary: Seznam studentů ve třídě
 *     tags:
 *       - Classes
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
 *         description: Studenti ve třídě
 *       404:
 *         description: Třída nenalezena
 */
router.get("/:id/students", auth, classCtrl.getClassStudents);

module.exports = router;
