/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Store settings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StoreSettings:
 *       type: object
 *       additionalProperties:
 *         type: string
 *       example:
 *         brandName: Flex it!
 *         tagline: Curated Fashion
 *         whatsappNumber: '923330215663'
 *         whatsappDefaultMessage: |
 *           Hello Flex it!
 *
 *           I'd like to know more about your collection.
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Public store settings
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Store settings
 *   put:
 *     summary: Update store settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreSettings'
 *     responses:
 *       200:
 *         description: Settings updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/settings/manage:
 *   get:
 *     summary: Admin store settings (full)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Admin settings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

module.exports = {};
