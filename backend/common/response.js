function jsonOk(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function jsonError(res, message, status = 400, details) {
  return res.status(status).json({ success: false, error: message, details });
}

module.exports = { jsonOk, jsonError };
