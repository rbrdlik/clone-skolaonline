const router = require("express").Router();
const gradeCtrl = require("../controllers/grade");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

/**
 * @swagger
 * /grades/student/{studentId}/summary:
 *   get:
 *     summary: Přehled známek studenta podle předmětů
 *     tags:
 *       - Grades
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Přehled známek
 *       500:
 *         description: Server error
 */
router.get("/student/:studentId/summary", gradeCtrl.getStudentGradesSummary);

/**
 * @swagger
 * /grades/student/{studentId}/all:
 *   get:
 *     summary: Všechny známky studenta
 *     tags:
 *       - Grades
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seznam známek
 *       500:
 *         description: Server error
 */
router.get("/student/:studentId/all", gradeCtrl.getAllStudentGrades);
/**
 * @openapi
 * /grades/student/{studentId}/subject/{subjectId}:
 *   get:
 *     summary: Známky studenta z konkrétního předmětu
 *     tags:
 *       - Grades
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seznam známek
 *       500:
 *         description: Server error
 */

router.get(
  "/student/:studentId/subject/:subjectId",
  gradeCtrl.getStudentGradesBySubject
);
/**
 * @openapi
 * /grades/check:
 *   get:
 *     summary: Kontrola, zda existují známky pro hodinu
 *     tags:
 *       - Grades
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Výsledek kontroly
 *       400:
 *         description: Chybějící parametry
 */
router.get("/check", gradeCtrl.checkGradesForLesson);
/**
 * @openapi
 * /grades/bulk:
 *   post:
 *     summary: Hromadné vytvoření známek
 *     tags:
 *       - Grades
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject_id
 *               - teacher_id
 *               - class_id
 *               - weight
 *               - grades
 *             properties:
 *               subject_id:
 *                 type: string
 *               teacher_id:
 *                 type: string
 *               class_id:
 *                 type: string
 *               weight:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               grades:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     student_id:
 *                       type: string
 *                     value:
 *                       type: number
 *     responses:
 *       201:
 *         description: Známky vytvořeny
 *       400:
 *         description: Nejsou zadány známky
 */

router.post("/bulk", gradeCtrl.createGradesBulk);
/**
 * @openapi
 * /grades/{id}:
 *   put:
 *     summary: Úprava známky
 *     tags:
 *       - Grades
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
 *               value:
 *                 oneOf:
 *                   - type: number
 *                   - type: string
 *                     example: NH
 *               weight:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Známka upravena
 *       404:
 *         description: Známka nenalezena
 */
router.put("/:id", auth, role("admin", "učitel"), gradeCtrl.updateGrade);
/**
 * @openapi
 * /grades/{id}:
 *   delete:
 *     summary: Smazání známky
 *     tags:
 *       - Grades
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
 *         description: Známka smazána
 *       404:
 *         description: Známka nenalezena
 */
router.delete("/:id", auth, role("admin", "učitel"), gradeCtrl.deleteGrade);

module.exports = router;
