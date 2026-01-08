const router = require("express").Router();
const subjectCtrl = require("../controllers/subject");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

/**
 * @openapi
 * /subject:
 *   get:
 *     summary: Získání všech předmětů
 *     tags:
 *       - Subject
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Předměty nalezeny
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Předměty nenalezeny
 *       500:
 *         description: Chyba serveru
 */
router.get("/", auth, subjectCtrl.getAllSubjects);

/**
 * @openapi
 * /subject/{id}:
 *   get:
 *     summary: Získání konkrétního předmětu podle ID
 *     tags:
 *       - Subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID předmětu
 *     responses:
 *       200:
 *         description: Předmět nalezen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Předmět nenalezen
 *       500:
 *         description: Chyba serveru
 */
router.get("/:id", auth, subjectCtrl.getSubjectById);

/**
 * @openapi
 * /subject:
 *   post:
 *     summary: Vytvoření nového předmětu
 *     tags:
 *       - Subject
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
 *               - short_name
 *             properties:
 *               name:
 *                 type: string
 *               short_name:
 *                 type: string
 *               teachers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: ID učitelů
 *     responses:
 *       201:
 *         description: Předmět vytvořen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Předmět nebyl vytvořen
 *       500:
 *         description: Chyba serveru
 */
router.post("/", auth, role("admin"), subjectCtrl.createSubject);

/**
 * @openapi
 * /subject/{id}:
 *   put:
 *     summary: Aktualizace předmětu
 *     tags:
 *       - Subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID předmětu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               short_name:
 *                 type: string
 *               teachers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Předmět aktualizován
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Předmět nebyl aktualizován
 *       500:
 *         description: Chyba serveru
 */
router.put("/:id", auth, role("admin"), subjectCtrl.updateSubject);

/**
 * @openapi
 * /subject/{id}:
 *   delete:
 *     summary: Odstranění předmětu
 *     tags:
 *       - Subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID předmětu
 *     responses:
 *       200:
 *         description: Předmět odstraněn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Předmět nebyl odstraněn
 *       500:
 *         description: Chyba serveru
 */
router.delete("/:id", auth, role("admin"), subjectCtrl.deleteSubject);

/**
 * @openapi
 * /subject/{id}/assign-teacher:
 *   post:
 *     summary: Přiřazení učitele k předmětu
 *     tags:
 *       - Subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID předmětu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *             properties:
 *               teacherId:
 *                 type: string
 *                 description: ID učitele
 *     responses:
 *       200:
 *         description: Učitel přiřazen k předmětu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Předmět nenalezen
 *       500:
 *         description: Chyba serveru
 */
router.post(
  "/:id/assign-teacher",
  auth,
  role("admin"),
  subjectCtrl.assignTeacherToSubject
);

/**
 * @openapi
 * /subject/{id}/remove-teacher:
 *   post:
 *     summary: Odebrání učitele z předmětu
 *     tags:
 *       - Subject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID předmětu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *             properties:
 *               teacherId:
 *                 type: string
 *                 description: ID učitele
 *     responses:
 *       200:
 *         description: Učitel odebrán z předmětu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Předmět nenalezen
 *       500:
 *         description: Chyba serveru
 */
router.post(
  "/:id/remove-teacher",
  auth,
  role("admin"),
  subjectCtrl.removeTeacherFromSubject
);

module.exports = router;
