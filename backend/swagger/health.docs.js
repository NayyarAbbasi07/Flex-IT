/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Service health checks
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthResponse:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 *         name:
 *           type: string
 *         version:
 *           type: string
 *         env:
 *           type: string
 *         db:
 *           type: string
 *           enum: [up, down, unknown]
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns API and database connectivity status.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service healthy
 *       503:
 *         description: Database unreachable
 */

module.exports = {};
