const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const { CustomErrorMiddleware } = require('./utils/errorHandlers/CustomErrorMiddleware');
const config = require('./config');
const { requestLogger } = require('./common/requestLogger');
const { prisma } = require('./service/prisma');
const { buildOpenApiSpec } = require('./swagger');

const app = express();

app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);
app.use(express.json({ limit: config.server.bodyLimit }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.use(
  '/uploads',
  express.static(path.join(process.cwd(), config.uploads.dir))
);

app.get('/health', async (_req, res) => {
  let db = 'unknown';
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = 'up';
  } catch {
    db = 'down';
  }
  const ok = db === 'up';
  res.status(ok ? 200 : 503).json({
    ok,
    name: config.app.name,
    version: config.app.version,
    env: config.app.env,
    db,
  });
});

const openApiSpec = buildOpenApiSpec();

app.get('/api/docs/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customSiteTitle: `${config.app.name} — API Docs`,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      tryItOutEnabled: true,
    },
  })
);

app.use('/api', routes);

app.use(CustomErrorMiddleware);

module.exports = app;
