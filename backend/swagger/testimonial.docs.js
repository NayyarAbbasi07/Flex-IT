/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Customer reviews
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Testimonial:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         productName:
 *           type: string
 *           nullable: true
 *         location:
 *           type: string
 *           nullable: true
 *         sortOrder:
 *           type: integer
 *         enabled:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateTestimonialRequest:
 *       type: object
 *       required: [name, comment]
 *       properties:
 *         name:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         productName:
 *           type: string
 *           nullable: true
 *         location:
 *           type: string
 *           nullable: true
 *         sortOrder:
 *           type: integer
 *         enabled:
 *           type: boolean
 *     UpdateTestimonialRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         productName:
 *           type: string
 *           nullable: true
 *         location:
 *           type: string
 *           nullable: true
 *         sortOrder:
 *           type: integer
 *         enabled:
 *           type: boolean
 */

/**
 * @swagger
 * /api/testimonials/submit:
 *   post:
 *     summary: Submit a review (public, pending approval)
 *     tags: [Testimonials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTestimonialRequest'
 *     responses:
 *       201:
 *         description: Review submitted (not published until admin approves)
 *       400:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: List enabled testimonials (public)
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: Testimonials list
 *   post:
 *     summary: Create testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTestimonialRequest'
 *     responses:
 *       201:
 *         description: Testimonial created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/testimonials/manage:
 *   get:
 *     summary: List all testimonials (admin)
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All testimonials
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: Update testimonial
 *     tags: [Testimonials]
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
 *             $ref: '#/components/schemas/UpdateTestimonialRequest'
 *     responses:
 *       200:
 *         description: Testimonial updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete testimonial
 *     tags: [Testimonials]
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
 *         description: Testimonial deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */

module.exports = {};
