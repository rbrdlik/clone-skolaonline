const router = require("express").Router();
const userCtrl = require("../controllers/user");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Získání všech uživatelů (admin)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uživatelé nalezeni
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
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: Uživatelé nenalezeni
 *       500:
 *         description: Chyba serveru
 */
router.get("/", auth, role("admin"), userCtrl.getAllUsers);

/**
 * @openapi
 * /user:
 *   post:
 *     summary: Vytvoření nového uživatele (admin)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - username
 *               - email
 *               - password
 *               - gender
 *               - date_of_birth
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [muž, žena]
 *               role:
 *                 type: string
 *                 enum: [student, učitel, admin]
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Uživatel vytvořen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Uživatel nebyl vytvořen
 *       500:
 *         description: Chyba serveru
 */
router.post("/", auth, role("admin"), userCtrl.createUser);

/**
 * @openapi
 * /user/students:
 *   get:
 *     summary: Získání všech studentů (admin, učitel)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Studenti nalezeni
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Chyba serveru
 */
router.get("/students", auth, role("admin", "učitel"), userCtrl.getAllStudents);

/**
 * @openapi
 * /user/students/without-class:
 *   get:
 *     summary: Získání studentů bez přiřazené třídy (admin)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Studenti nalezeni
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Chyba serveru
 */
router.get(
  "/students/without-class",
  auth,
  role("admin"),
  userCtrl.getStudentsWithoutClass
);

/**
 * @openapi
 * /user/students/class/{classId}:
 *   get:
 *     summary: Získání studentů podle třídy (admin, učitel)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID třídy
 *     responses:
 *       200:
 *         description: Studenti nalezeni
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Třída nenalezena
 *       500:
 *         description: Chyba serveru
 */
router.get(
  "/students/class/:classId",
  auth,
  role("admin", "učitel"),
  userCtrl.getStudentsByClass
);

/**
 * @openapi
 * /user/teachers:
 *   get:
 *     summary: Získání všech učitelů (admin)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Učitelé nalezeni
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Chyba serveru
 */
router.get("/teachers", auth, role("admin"), userCtrl.getAllTeachers);

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Získání konkrétního uživatele podle ID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID uživatele
 *     responses:
 *       200:
 *         description: Uživatel nalezen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Uživatel nenalezen
 *       500:
 *         description: Chyba serveru
 */
router.get("/:id", auth, userCtrl.getUserById);

/**
 * @openapi
 * /user/{id}:
 *   put:
 *     summary: Aktualizace uživatele (admin)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID uživatele
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [muž, žena]
 *               role:
 *                 type: string
 *                 enum: [student, učitel, admin]
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Uživatel aktualizován
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Uživatel nebyl aktualizován
 *       500:
 *         description: Chyba serveru
 */
router.put("/:id", auth, role("admin"), userCtrl.updateUser);

/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     summary: Odstranění uživatele (admin)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID uživatele
 *     responses:
 *       200:
 *         description: Uživatel odstraněn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Uživatel nebyl odstraněn
 *       500:
 *         description: Chyba serveru
 */
router.delete("/:id", auth, role("admin"), userCtrl.deleteUser);

module.exports = router;
