/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Storefront catalog and admin product CRUD
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StorefrontProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         slug:
 *           type: string
 *           example: nike-air-force-1-white
 *         sku:
 *           type: string
 *           example: NIK-AF1-001
 *         name:
 *           type: string
 *           example: Air Force 1 '07
 *         brand:
 *           type: string
 *           example: Nike
 *         category:
 *           type: string
 *           example: shoes
 *         collection:
 *           type: string
 *           example: nike
 *         price:
 *           type: integer
 *           example: 18900
 *         compareAtPrice:
 *           type: integer
 *           nullable: true
 *         currency:
 *           type: string
 *           example: PKR
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *         inventory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SizeInventory'
 *         condition:
 *           type: string
 *           example: excellent
 *         availability:
 *           type: string
 *           enum: [available, sold, reserved]
 *         color:
 *           type: string
 *         description:
 *           type: string
 *         featured:
 *           type: boolean
 *         newest:
 *           type: boolean
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductImage'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date
 *     AdminProduct:
 *       allOf:
 *         - $ref: '#/components/schemas/StorefrontProduct'
 *         - type: object
 *           properties:
 *             status:
 *               $ref: '#/components/schemas/ProductStatus'
 *             gender:
 *               $ref: '#/components/schemas/Gender'
 *             shoeType:
 *               type: string
 *               example: Sneakers
 *             discountPrice:
 *               type: integer
 *               nullable: true
 *             brandId:
 *               type: string
 *               format: uuid
 *             categoryId:
 *               type: string
 *               format: uuid
 *               nullable: true
 *             features:
 *               type: array
 *               items:
 *                 type: string
 *             bestSeller:
 *               type: boolean
 *             newArrival:
 *               type: boolean
 *     ProductInventoryInput:
 *       type: object
 *       required: [size, quantity]
 *       properties:
 *         size:
 *           type: string
 *           example: '42'
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           example: 3
 *         lowStockAt:
 *           type: integer
 *           minimum: 0
 *           example: 2
 *     ProductImageInput:
 *       type: object
 *       required: [url]
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         url:
 *           type: string
 *         alt:
 *           type: string
 *         sortOrder:
 *           type: integer
 *         isPrimary:
 *           type: boolean
 *     CreateProductRequest:
 *       type: object
 *       required: [name, brandId, price]
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *         slug:
 *           type: string
 *         sku:
 *           type: string
 *         description:
 *           type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         brandId:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         gender:
 *           $ref: '#/components/schemas/Gender'
 *         shoeType:
 *           type: string
 *         condition:
 *           $ref: '#/components/schemas/ConditionGrade'
 *         originalBrand:
 *           type: string
 *           nullable: true
 *         importedFrom:
 *           type: string
 *           nullable: true
 *         color:
 *           type: string
 *         price:
 *           type: integer
 *           minimum: 1
 *         discountPrice:
 *           type: integer
 *           nullable: true
 *         featured:
 *           type: boolean
 *         newArrival:
 *           type: boolean
 *         bestSeller:
 *           type: boolean
 *         status:
 *           $ref: '#/components/schemas/ProductStatus'
 *         inventory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInventoryInput'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductImageInput'
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *         slug:
 *           type: string
 *         sku:
 *           type: string
 *         description:
 *           type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         brandId:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         gender:
 *           $ref: '#/components/schemas/Gender'
 *         shoeType:
 *           type: string
 *         condition:
 *           $ref: '#/components/schemas/ConditionGrade'
 *         originalBrand:
 *           type: string
 *           nullable: true
 *         importedFrom:
 *           type: string
 *           nullable: true
 *         color:
 *           type: string
 *         price:
 *           type: integer
 *           minimum: 1
 *         discountPrice:
 *           type: integer
 *           nullable: true
 *         featured:
 *           type: boolean
 *         newArrival:
 *           type: boolean
 *         bestSeller:
 *           type: boolean
 *         status:
 *           $ref: '#/components/schemas/ProductStatus'
 *         inventory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInventoryInput'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductImageInput'
 *     BulkProductStatusRequest:
 *       type: object
 *       required: [ids, status]
 *       properties:
 *         ids:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: string
 *             format: uuid
 *         status:
 *           $ref: '#/components/schemas/ProductStatus'
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List published products (storefront)
 *     description: Public catalog for shop page. No authentication required.
 *     tags: [Products]
 *     parameters:
 *       - name: q
 *         in: query
 *         schema:
 *           type: string
 *         description: Search query
 *       - name: brand
 *         in: query
 *         schema:
 *           type: string
 *         description: Brand slug filter
 *       - name: collection
 *         in: query
 *         schema:
 *           type: string
 *         description: Alias for brand slug
 *       - name: size
 *         in: query
 *         schema:
 *           type: string
 *         description: EU size filter
 *       - name: featured
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: available
 *         in: query
 *         schema:
 *           type: boolean
 *         description: Only in-stock items
 *       - name: newest
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: newArrival
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           enum: [newest, featured, price-asc, price-desc, name]
 *           default: newest
 *     responses:
 *       200:
 *         description: Products list
 *   post:
 *     summary: Create product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Featured products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Featured products
 */

/**
 * @swagger
 * /api/products/latest:
 *   get:
 *     summary: Latest products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Latest products
 */

/**
 * @swagger
 * /api/products/manage:
 *   get:
 *     summary: Admin product list (paginated)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           $ref: '#/components/schemas/ProductStatus'
 *       - name: brandId
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: categoryId
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated admin products
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/products/low-stock:
 *   get:
 *     summary: Low stock inventory
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Low stock rows
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/products/bulk-status:
 *   put:
 *     summary: Bulk update product status
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkProductStatusRequest'
 *     responses:
 *       200:
 *         description: Bulk update result
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/products/id/{id}:
 *   get:
 *     summary: Get product by ID (admin)
 *     tags: [Products]
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
 *         description: Product
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update product
 *     tags: [Products]
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
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Updated product
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete product (soft delete)
 *     tags: [Products]
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
 *         description: Deleted product
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/products/{slug}:
 *   get:
 *     summary: Get product by slug (storefront)
 *     tags: [Products]
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product detail
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/products/{slug}/related:
 *   get:
 *     summary: Related products
 *     tags: [Products]
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Related products
 *       404:
 *         description: Not found
 */

module.exports = {};
