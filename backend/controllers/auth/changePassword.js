const { authService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

const schema = Joi.object().keys({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = async function changePassword(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await authService.changePassword(
      req.user.id,
      validate.currentPassword,
      validate.newPassword
    );
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password updated',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
