const { getTokenFromRequest, verifyToken } = require('../utils/jwt');

/**
 * Auth + optional role gate (TNE-style).
 *
 * @example
 * authenticationMiddleware() // any logged-in user
 * authenticationMiddleware([RoleAuthorizationTypes.Admin])
 * authenticationMiddleware([RoleAuthorizationTypes.Admin, RoleAuthorizationTypes.Customer])
 */
function authenticationMiddleware(roles = []) {
  const allowed = Array.isArray(roles) ? roles : [];

  return function authMiddleware(req, res, next) {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    req.user = payload;

    if (allowed.length > 0 && !allowed.includes(payload.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    next();
  };
}

/** Attach req.user when a valid token is present; never blocks. */
function optionalAuthenticationMiddleware(req, _res, next) {
  const token = getTokenFromRequest(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload) req.user = payload;
  }
  next();
}

module.exports = { authenticationMiddleware, optionalAuthenticationMiddleware };
