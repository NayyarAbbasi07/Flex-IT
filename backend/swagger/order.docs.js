/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management (admin)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           format: uuid
 *         productName:
 *           type: string
 *         size:
 *           type: string
 *         quantity:
 *           type: integer
 *         unitPrice:
 *           type: integer
 *         product:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *             sku:
 *               type: string
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         customerName:
 *           type: string
 *         phone:
 *           type: string
 *         city:
 *           type: string
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 *         whatsappNote:
 *           type: string
 *           nullable: true
 *         totalAmount:
 *           type: integer
 *         currency:
 *           type: string
 *           example: PKR
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderItemInput:
 *       type: object
 *       required: [productId, size]
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *         size:
 *           type: string
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         unitPrice:
 *           type: integer
 *           minimum: 1
 *     CreateOrderRequest:
 *       type: object
 *       required: [customerName, phone, items]
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         customerName:
 *           type: string
 *         phone:
 *           type: string
 *           minLength: 7
 *         city:
 *           type: string
 *           nullable: true
 *         whatsappNote:
 *           type: string
 *           nullable: true
 *         currency:
 *           type: string
 *           default: PKR
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *     UpdateOrderRequest:
 *       type: object
 *       properties:
 *         customerName:
 *           type: string
 *         phone:
 *           type: string
 *           minLength: 7
 *         city:
 *           type: string
 *           nullable: true
 *         whatsappNote:
 *           type: string
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List orders (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           $ref: '#/components/schemas/OrderStatus'
 *     responses:
 *       200:
 *         description: Orders list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create order (admin)
 *     description: Confirming status decrements inventory. Cancelling restores stock.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/orders/mine:
 *   get:
 *     summary: My orders (customer)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Customer orders
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order (admin)
 *     tags: [Orders]
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
 *         description: Order
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
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
 *             $ref: '#/components/schemas/UpdateOrderRequest'
 *     responses:
 *       200:
 *         description: Order updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */

module.exports = {};
