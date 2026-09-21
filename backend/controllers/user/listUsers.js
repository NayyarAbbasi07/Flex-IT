const { userService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { roleValues } = require('../../common/enumFunction');

module.exports = async function listUsers(req, res, next) {
  try {
    const role = req.query.role;
    if (role && !roleValues.includes(role)) {
      throw new CustomError('Invalid role filter', 400);
    }

    const data = await userService.listUsers(role || undefined);
    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: data.users,
    });
  } catch (error) {
    next(error);
  }
};
