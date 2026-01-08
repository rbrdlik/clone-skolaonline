const router = require("express").Router();
const scheduleChangesCtrl = require("../controllers/scheduleChanges");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

/**
 * @openapi
 * /scheduleChanges:
 *   get:
 *     summary: Získání změn rozvrhu pro třídu a den
 *     tags:
 *       - ScheduleChanges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID třídy
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Den, pro který chceme změny
 *     responses:
 *       200:
 *         description: Seznam změn pro daný den
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 changes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ScheduleChangeItem'
 *       400:
 *         description: Chybí classId nebo date
 *       500:
 *         description: Chyba serveru
 */
router.get("/", auth, scheduleChangesCtrl.getScheduleChangesByClassAndDate);

/**
 * @openapi
 * /scheduleChanges:
 *   post:
 *     summary: Vytvoření nebo aktualizace změny rozvrhu
 *     tags:
 *       - ScheduleChanges
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - class_id
 *               - date
 *               - hour
 *               - type
 *               - subject
 *               - teacher
 *             properties:
 *               class_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               hour:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [cancel, change, note, room_change]
 *               subject:
 *                 type: string
 *               teacher:
 *                 type: string
 *               room:
 *                 type: string
 *               group_id:
 *                 type: string
 *                 nullable: true
 *               grade:
 *                 type: string
 *                 nullable: true
 *               substitute_teacher:
 *                 type: string
 *                 nullable: true
 *               note:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Změna rozvrhu vytvořena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleChanges'
 *       200:
 *         description: Změna rozvrhu aktualizována
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleChanges'
 *       400:
 *         description: Chybí povinná data
 *       500:
 *         description: Chyba serveru
 */
router.post(
  "/",
  auth,
  role("admin", "učitel"),
  scheduleChangesCtrl.createScheduleChange
);

/**
 * @openapi
 * /scheduleChanges/hour:
 *   delete:
 *     summary: Odstranění konkrétní hodiny změny rozvrhu
 *     tags:
 *       - ScheduleChanges
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - class_id
 *               - date
 *               - hour
 *             properties:
 *               class_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               hour:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Změna hodiny odstraněna
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleChanges'
 *       404:
 *         description: Změna nenalezena
 *       500:
 *         description: Chyba serveru
 */
router.delete(
  "/hour",
  auth,
  role("admin", "učitel"),
  scheduleChangesCtrl.deleteScheduleChangeHour
);

/**
 * @openapi
 * /scheduleChanges/day:
 *   delete:
 *     summary: Odstranění všech změn pro daný den
 *     tags:
 *       - ScheduleChanges
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - class_id
 *               - date
 *             properties:
 *               class_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       204:
 *         description: Změny odstraněny
 *       500:
 *         description: Chyba serveru
 */
router.delete(
  "/day",
  auth,
  role("admin", "učitel"),
  scheduleChangesCtrl.deleteScheduleChangeDay
);

module.exports = router;
