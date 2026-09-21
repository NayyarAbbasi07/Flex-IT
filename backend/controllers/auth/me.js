const { authService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function me(req, res, next) {
  try {
    const data = await authService.getUserById(req.user.id);
    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'User fetched',
      data: data.user,
    });
  } catch (error) {
    next(error);
  }
};
