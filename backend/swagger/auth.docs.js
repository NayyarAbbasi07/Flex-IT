/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Login, register, session
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *           nullable: true
 *         role:
 *           $ref: '#/components/schemas/Role'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@flexit.store
 *         password:
 *           type: string
 *           minLength: 6
 *           example: your-admin-password
 *         remember:
 *           type: boolean
 *           default: false
 *           example: false
 *     RegisterRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         name:
 *           type: string
 *           nullable: true
 *     ChangePasswordRequest:
 *       type: object
 *       required: [currentPassword, newPassword]
 *       properties:
 *         currentPassword:
 *           type: string
 *           minLength: 6
 *         newPassword:
 *           type: string
 *           minLength: 6
 *     AuthSession:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register customer account
 *     description: Creates a CUSTOMER role account. Not required for WhatsApp-only shopping.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Account created
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: Authenticates Admin or Customer. Sets `flexit_token` HTTP-only cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@flexit.store
 *               password:
 *                 type: string
 *                 example: your-admin-password
 *               remember:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     description: Clears the auth cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Current session
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

module.exports = {};
