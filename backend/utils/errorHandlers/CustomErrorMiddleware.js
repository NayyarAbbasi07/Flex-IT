function CustomErrorMiddleware(err, _req, res, _next) {
  if (err.name === 'ValidationError' || err.isJoi) {
    return res.status(422).json({ success: false, error: err.message, details: err.details });
  }
  const status = err.statusCode || 500;
  return res.status(status).json({ success: false, error: err.message || 'Internal server error' });
}

module.exports = { CustomErrorMiddleware };
