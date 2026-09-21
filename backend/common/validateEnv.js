/**
 * Fail fast when required secrets/env are missing in production.
 * In development, warn but allow defaults from config.js.
 */
function validateEnv(config) {
  const missing = [];
  if (!config.database.url) missing.push('DATABASE_URL');
  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
    if (config.app.isProd) missing.push('AUTH_SECRET');
    else console.warn('[config] AUTH_SECRET not set — using development default');
  }

  if (missing.length) {
    const msg = `Missing required environment variables: ${missing.join(', ')}`;
    if (config.app.isProd) {
      throw new Error(msg);
    }
    console.warn(`[config] ${msg}`);
  }
}

module.exports = { validateEnv };
