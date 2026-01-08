const router = require("express").Router();
const scheduleCtrl = require("../controllers/schedule");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

/**
 * @openapi
 * /schedule/student:
 *   get:
 *     summary: Získání rozvrhu studenta pro konkrétní den
 *     tags:
 *       - Schedule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID studenta
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Den, pro který se má rozvrh získat
 *     responses:
 *       200:
 *         description: Rozvrh studenta pro daný den
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Neplatný den
 *       404:
 *         description: Třída nenalezena
 */
router.get("/student", scheduleCtrl.getStudentScheduleForDay);

/**
 * @openapi
 * /schedule/student/lesson-detail:
 *   get:
 *     summary: Získání detailu konkrétní hodiny studenta
 *     tags:
 *       - Schedule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: hour
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail hodiny
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonDetail'
 *       400:
 *         description: Neplatný den
 *       404:
 *         description: Hodina nebo třída nenalezena
 */
router.get("/student/lesson-detail", scheduleCtrl.getStudentLessonDetail);

/**
 * @openapi
 * /schedule/teacher:
 *   get:
 *     summary: Získání rozvrhu učitele pro konkrétní den
 *     tags:
 *       - Schedule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: teacherId
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
 *         description: Rozvrh učitele
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LessonTeacher'
 *       400:
 *         description: Neplatný den
 */
router.get("/teacher", scheduleCtrl.getTeacherScheduleForDay);

/**
 * @openapi
 * /schedule/class:
 *   get:
 *     summary: Získání rozvrhu třídy pro konkrétní den
 *     tags:
 *       - Schedule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: includeCancelled
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Zahrnout zrušené hodiny
 *     responses:
 *       200:
 *         description: Rozvrh třídy
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Neplatný den
 */
router.get("/class", scheduleCtrl.getClassScheduleForDay);

/**
 * @openapi
 * /schedule:
 *   post:
 *     summary: Vytvoření rozvrhu pro třídu a den
 *     tags:
 *       - Schedule
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
 *               - dayOfWeek
 *               - lessons
 *             properties:
 *               class_id:
 *                 type: string
 *               dayOfWeek:
 *                 type: integer
 *                 enum: [1,2,3,4,5]
 *               lessons:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Lesson'
 *     responses:
 *       201:
 *         description: Rozvrh vytvořen nebo aktualizován
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Chyba serveru
 */
router.post("/", scheduleCtrl.createSchedule);

/**
 * @openapi
 * /schedule/{id}:
 *   put:
 *     summary: Aktualizace existujícího rozvrhu
 *     tags:
 *       - Schedule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID rozvrhu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Rozvrh aktualizován
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Rozvrh nenalezen
 *       500:
 *         description: Chyba serveru
 */
router.put("/:id", scheduleCtrl.updateSchedule);

module.exports = router;
