const { StatusCodes } = require('http-status-codes');
const { clearAuthCookie } = require('../../utils/jwt');

module.exports = async function logout(req, res, next) {
  try {
    clearAuthCookie(res);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logged out',
      data: { ok: true },
    });
  } catch (error) {
    next(error);
  }
};
