/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: Brand-based collections (public)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Collection:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         slug:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         productCount:
 *           type: integer
 *         featured:
 *           type: boolean
 *         image:
 *           $ref: '#/components/schemas/ProductImage'
 */

/**
 * @swagger
 * /api/collections:
 *   get:
 *     summary: List brand collections
 *     tags: [Collections]
 *     responses:
 *       200:
 *         description: Collections list
 */

/**
 * @swagger
 * /api/collections/{slug}:
 *   get:
 *     summary: Get collection with products
 *     tags: [Collections]
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Collection detail
 *       404:
 *         description: Not found
 */

module.exports = {};
