/**
 * @swagger
 * tags:
 *   name: FAQs
 *   description: Frequently asked questions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Faq:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         question:
 *           type: string
 *         answer:
 *           type: string
 *         sortOrder:
 *           type: integer
 *         enabled:
 *           type: boolean
 *     CreateFaqRequest:
 *       type: object
 *       required: [question, answer]
 *       properties:
 *         question:
 *           type: string
 *           minLength: 3
 *         answer:
 *           type: string
 *           minLength: 1
 *         sortOrder:
 *           type: integer
 *         enabled:
 *           type: boolean
 *     UpdateFaqRequest:
 *       type: object
 *       properties:
 *         question:
 *           type: string
 *           minLength: 3
 *         answer:
 *           type: string
 *           minLength: 1
 *         sortOrder:
 *           type: integer
 *         enabled:
 *           type: boolean
 */

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: List enabled FAQs (public)
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: FAQs list
 *   post:
 *     summary: Create FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFaqRequest'
 *     responses:
 *       201:
 *         description: FAQ created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/faqs/manage:
 *   get:
 *     summary: List all FAQs (admin)
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All FAQs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/faqs/{id}:
 *   put:
 *     summary: Update FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFaqRequest'
 *     responses:
 *       200:
 *         description: FAQ updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: FAQ deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */

module.exports = {};
