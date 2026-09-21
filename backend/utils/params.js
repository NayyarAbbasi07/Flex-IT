/** Normalize Express route params that may be string | string[]. */
function param(value) {
  if (Array.isArray(value)) return String(value[0] ?? "");
  if (value === undefined || value === null) return "";
  return String(value);
}

module.exports = { param };
