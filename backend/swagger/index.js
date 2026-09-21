const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const config = require('../config');
const {
  roleValues,
  productStatusValues,
  conditionGradeValues,
  genderValues,
  inquiryStatusValues,
  inquirySourceValues,
  orderStatusValues,
} = require('../common/enumFunction');

function buildOpenApiSpec() {
  return swaggerJsdoc({
    definition: {
      openapi: '3.0.3',
      info: {
        title: config.app.name,
        version: config.app.version,
        description: [
          'REST API for **Flex it!** — a WhatsApp-first curated thrift sneaker store (Pakistan, PKR).',
          '',
          '## Authentication',
          '- **Public**: storefront catalog, settings, FAQs, testimonials, inquiries.',
          '- **Admin** (`ADMIN` role): full CMS — products, media, orders, stats.',
          '- **Customer** (`CUSTOMER` role): optional account for `/mine` endpoints.',
          '',
          'Login via `POST /api/auth/login` sets an HTTP-only cookie (`flexit_token`).',
          'You can also send `Authorization: Bearer <token>` for API clients.',
          '',
          '## Commerce model',
          'Shoppers browse online and buy via WhatsApp. No cart or payment gateway.',
        ].join('\n'),
        contact: {
          name: 'Flex it! Store',
          email: 'hello@flexit.store',
        },
      },
      servers: [
        {
          url: `http://localhost:${config.server.port}`,
          description: 'Local development',
        },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: config.auth.cookieName,
            description: `JWT session cookie set by POST /api/auth/login (${config.auth.cookieName})`,
          },
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Alternative to cookie auth — use the token from login response',
          },
        },
        schemas: {
          Role: { type: 'string', enum: roleValues },
          ProductStatus: { type: 'string', enum: productStatusValues },
          ConditionGrade: { type: 'string', enum: conditionGradeValues },
          Gender: { type: 'string', enum: genderValues },
          InquiryStatus: { type: 'string', enum: inquiryStatusValues },
          InquirySource: { type: 'string', enum: inquirySourceValues },
          OrderStatus: { type: 'string', enum: orderStatusValues },
        },
        responses: {
          Unauthorized: {
            description: 'Missing or invalid authentication token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: { success: false, error: 'Unauthorized' },
              },
            },
          },
          Forbidden: {
            description: 'Authenticated but insufficient role',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: { success: false, error: 'Forbidden' },
              },
            },
          },
          BadRequest: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
              },
            },
          },
          NotFound: {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
              },
            },
          },
        },
      },
    },
    // Glob needs forward slashes on Windows or `*.docs.js` matches nothing.
    apis: [path.join(__dirname, '*.docs.js').replace(/\\/g, '/')],
  });
}

module.exports = { buildOpenApiSpec };
