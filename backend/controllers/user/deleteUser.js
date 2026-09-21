const { userService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

module.exports = async function deleteUser(req, res, next) {
  try {
    const data = await userService.deleteUser(param(req.params.id), req.user?.id);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'User deleted',
      data: data.user,
    });
  } catch (error) {
    next(error);
  }
};
