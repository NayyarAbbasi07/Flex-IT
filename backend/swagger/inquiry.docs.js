/**
 * @swagger
 * tags:
 *   name: Inquiries
 *   description: WhatsApp / web lead requests
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Inquiry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         productId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         size:
 *           type: string
 *           nullable: true
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *           nullable: true
 *         city:
 *           type: string
 *           nullable: true
 *         message:
 *           type: string
 *         status:
 *           $ref: '#/components/schemas/InquiryStatus'
 *         source:
 *           $ref: '#/components/schemas/InquirySource'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         product:
 *           $ref: '#/components/schemas/StorefrontProduct'
 *     CreateInquiryRequest:
 *       type: object
 *       required: [name, phone]
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         size:
 *           type: string
 *           nullable: true
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *           minLength: 7
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *         city:
 *           type: string
 *           nullable: true
 *         message:
 *           type: string
 *         source:
 *           $ref: '#/components/schemas/InquirySource'
 *     UpdateInquiryRequest:
 *       type: object
 *       properties:
 *         status:
 *           $ref: '#/components/schemas/InquiryStatus'
 *         message:
 *           type: string
 *         city:
 *           type: string
 *           nullable: true
 *         size:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /api/inquiries:
 *   get:
 *     summary: List inquiries (admin)
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           $ref: '#/components/schemas/InquiryStatus'
 *       - name: q
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inquiries list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Submit inquiry
 *     description: Public endpoint. Optionally links to logged-in customer if token is present.
 *     tags: [Inquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInquiryRequest'
 *     responses:
 *       201:
 *         description: Inquiry submitted
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/inquiries/mine:
 *   get:
 *     summary: My inquiries (customer)
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Customer inquiries
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/inquiries/{id}:
 *   get:
 *     summary: Get inquiry (admin)
 *     tags: [Inquiries]
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
 *         description: Inquiry
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update inquiry status
 *     tags: [Inquiries]
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
 *             $ref: '#/components/schemas/UpdateInquiryRequest'
 *     responses:
 *       200:
 *         description: Inquiry updated
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
