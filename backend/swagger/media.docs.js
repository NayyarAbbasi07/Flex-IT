/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Image uploads (admin)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MediaAsset:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         filename:
 *           type: string
 *         url:
 *           type: string
 *         mimeType:
 *           type: string
 *         size:
 *           type: integer
 *         folder:
 *           type: string
 *         alt:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: List media assets
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Media library
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Upload media file
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: JPEG, PNG, or WebP (max 5MB)
 *               folder:
 *                 type: string
 *                 default: uploads
 *               alt:
 *                 type: string
 *     responses:
 *       201:
 *         description: Media uploaded
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   delete:
 *     summary: Delete media asset
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Media deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */

module.exports = {};
