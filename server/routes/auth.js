const router = require("express").Router();
const authCtrl = require("../controllers/auth");
const auth = require("../middlewares/auth");

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrace nového uživatele
 *     tags:
 *       - Auth
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
 *         description: Uživatelský účet vytvořen
 *       400:
 *         description: Chyba při registraci
 */
router.post("/register", authCtrl.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Přihlášení uživatele
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Přihlášení úspěšné, vrací access a refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Neplatné přihlašovací údaje
 */
router.post("/login", authCtrl.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Obnovení access tokenu pomocí refresh tokenu
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vrací nový access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Chybějící refresh token
 *       403:
 *         description: Neplatný refresh token
 */
router.post("/refresh", authCtrl.refreshToken);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Odhlášení uživatele
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       204:
 *         description: Úspěšné odhlášení (refresh token smazán)
 */
router.post("/logout", authCtrl.logout);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Získání informací o přihlášeném uživateli
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data přihlášeného uživatele
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Neautorizovaný
 */
router.get("/me", auth, authCtrl.me);

module.exports = router;
