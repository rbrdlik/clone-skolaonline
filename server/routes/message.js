const router = require("express").Router();
const messageCtrl = require("../controllers/message");
const auth = require("../middlewares/auth");

/**
 * @openapi
 * /message/student/{studentId}:
 *   get:
 *     summary: Získání všech zpráv pro konkrétního studenta (třída, skupina, individuálně)
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID studenta
 *     responses:
 *       200:
 *         description: Seznam zpráv seskupených podle měsíců
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     author:
 *                       type: object
 *                       properties:
 *                         first_name:
 *                           type: string
 *                         last_name:
 *                           type: string
 *                         gender:
 *                           type: string
 *                           enum: [muž, žena]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Student nemá přiřazenou třídu nebo zprávy nenalezeny
 */
router.get("/student/:studentId", messageCtrl.getMessagesForStudent);

/**
 * @openapi
 * /message/{id}:
 *   get:
 *     summary: Získání detailu zprávy podle ID
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID zprávy
 *     responses:
 *       200:
 *         description: Detail zprávy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: object
 *                   properties:
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     gender:
 *                       type: string
 *                       enum: [muž, žena]
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Zpráva nenalezena
 */
router.get("/:id", messageCtrl.getMessageDetail);

/**
 * @openapi
 * /message:
 *   post:
 *     summary: Vytvoření nové zprávy (student, třída, skupina)
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender_id
 *               - title
 *               - content
 *             properties:
 *               sender_id:
 *                 type: string
 *               class_id:
 *                 type: string
 *                 nullable: true
 *               group_id:
 *                 type: string
 *                 nullable: true
 *               recipient_id:
 *                 type: string
 *                 nullable: true
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Zpráva vytvořena
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payload:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Zpráva musí mít příjemce (student / třída / skupina)
 *       500:
 *         description: Chyba serveru
 */
router.post("/", messageCtrl.createMessage);

module.exports = router;
