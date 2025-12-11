const express = require('express');
const router = express.Router();

const gradesController = require('../controllers/grades');

/**
 * @swagger
 * /grades:
 *   get:
 *     summary: Get all grades
 *     responses:
 *       200:
 *         description: A list of grades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 */
router.get('/', gradesController.getAllGrades);

/**
 * @swagger
 * /grades/{id}:
 *   get:
 *     summary: Get a grade by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the grade to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single grade
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 */
router.get('/:id', gradesController.getGradeById);

/**
 * @swagger
 * /grades:
 *   post:
 *     summary: Create a new grade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grade'
 *     responses:
 *       201:
 *         description: Grade created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 */
router.post('/', gradesController.createGrade);

/**
 * @swagger
 * /grades/{id}:
 *   put:
 *     summary: Update a grade by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the grade to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grade'
 *     responses:
 *       200:
 *         description: Grade updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 */
router.put('/:id', gradesController.updateGrade);

/**
 * @swagger
 * /grades/{id}:
 *   delete:
 *     summary: Delete a grade by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the grade to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Grade deleted successfully
 */
router.delete('/:id', gradesController.deleteGrade);

module.exports = router;
