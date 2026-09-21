/**
 * @swagger
 * components:
 *   schemas:
 *     ApiSuccess:
 *       type: object
 *       required: [success]
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data: {}
 *     ApiError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *         message:
 *           type: string
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         pageSize:
 *           type: integer
 *           example: 20
 *         total:
 *           type: integer
 *           example: 48
 *         totalPages:
 *           type: integer
 *           example: 3
 *     SizeInventory:
 *       type: object
 *       properties:
 *         size:
 *           type: string
 *           example: '42'
 *         quantity:
 *           type: integer
 *           example: 2
 *         available:
 *           type: boolean
 *           example: true
 *         lowStock:
 *           type: boolean
 *           example: false
 *     ProductImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         url:
 *           type: string
 *           example: /uploads/af1-1.jpg
 *         alt:
 *           type: string
 *         sortOrder:
 *           type: integer
 *         isPrimary:
 *           type: boolean
 */

module.exports = {};
