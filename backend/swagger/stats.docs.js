/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Dashboard statistics (admin)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         products:
 *           type: integer
 *         publishedProducts:
 *           type: integer
 *         lowStockCount:
 *           type: integer
 *         inquiries:
 *           type: integer
 *         newInquiries:
 *           type: integer
 *         orders:
 *           type: integer
 *         pendingOrders:
 *           type: integer
 *         brands:
 *           type: integer
 *         categories:
 *           type: integer
 */

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Dashboard statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

module.exports = {};
