const jwt = require('jsonwebtoken');
const config = require('../config');

function signToken(payload, remember) {
  const expiresInSeconds = remember
    ? config.auth.jwtRememberExpiresInSeconds
    : config.auth.jwtExpiresInSeconds;
  return jwt.sign(payload, config.auth.secret, { expiresIn: expiresInSeconds });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, config.auth.secret);
  } catch {
    return null;
  }
}

function getTokenFromRequest(req) {
  const cookie = req.cookies?.[config.auth.cookieName];
  if (cookie) return cookie;
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return null;
}

function setAuthCookie(res, token, remember) {
  const maxAge = remember
    ? config.auth.jwtRememberExpiresInSeconds * 1000
    : config.auth.jwtExpiresInSeconds * 1000;

  res.cookie(config.auth.cookieName, token, {
    httpOnly: true,
    sameSite: config.auth.cookieSameSite,
    secure: config.app.isProd,
    maxAge,
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie(config.auth.cookieName, { path: '/' });
}

module.exports = {
  signToken,
  verifyToken,
  getTokenFromRequest,
  setAuthCookie,
  clearAuthCookie,
};
