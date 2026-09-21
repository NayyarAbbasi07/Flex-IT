/**
 * @swagger
 * tags:
 *   name: Hero
 *   description: Homepage hero section
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HeroSection:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         heading:
 *           type: string
 *         subheading:
 *           type: string
 *         description:
 *           type: string
 *         primaryCtaText:
 *           type: string
 *         primaryCtaHref:
 *           type: string
 *         secondaryCtaText:
 *           type: string
 *         imageUrls:
 *           type: array
 *           items:
 *             type: string
 *         enabled:
 *           type: boolean
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UpdateHeroRequest:
 *       type: object
 *       required: [heading, subheading, description]
 *       properties:
 *         heading:
 *           type: string
 *         subheading:
 *           type: string
 *         description:
 *           type: string
 *         primaryCtaText:
 *           type: string
 *         primaryCtaHref:
 *           type: string
 *         secondaryCtaText:
 *           type: string
 *         imageUrls:
 *           type: array
 *           items:
 *             type: string
 *         enabled:
 *           type: boolean
 */

/**
 * @swagger
 * /api/hero:
 *   get:
 *     summary: Get homepage hero section
 *     tags: [Hero]
 *     responses:
 *       200:
 *         description: Hero section
 *   put:
 *     summary: Update homepage hero
 *     tags: [Hero]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateHeroRequest'
 *     responses:
 *       200:
 *         description: Hero updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

module.exports = {};
