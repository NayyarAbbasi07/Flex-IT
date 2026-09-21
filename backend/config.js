/**
 * App config — sits next to config.json.
 * Defaults: config.json | Secrets/overrides: .env
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const fileConfig = require('./config.json');

const config = {
  ...fileConfig,

  app: {
    ...fileConfig.app,
    env: process.env.NODE_ENV || 'development',
    isProd: process.env.NODE_ENV === 'production',
  },

  server: {
    ...fileConfig.server,
    port: Number(process.env.PORT) || fileConfig.server.port,
    host: process.env.HOST || fileConfig.server.host,
  },

  cors: {
    ...fileConfig.cors,
    origin: process.env.CORS_ORIGIN || fileConfig.cors.origin,
  },

  auth: {
    ...fileConfig.auth,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret',
  },

  database: {
    url: process.env.DATABASE_URL || '',
  },

  admin: {
    password: process.env.ADMIN_PASSWORD || 'FlexitAdmin123!',
  },

  store: {
    ...fileConfig.store,
    defaultWhatsappNumber:
      process.env.WHATSAPP_NUMBER || fileConfig.store.defaultWhatsappNumber,
  },
};

module.exports = config;
