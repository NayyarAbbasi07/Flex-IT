const { userService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');
const { roleValues } = require('../../common/enumFunction');

const schema = Joi.object().keys({
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  name: Joi.string().allow(null, '').optional(),
  role: Joi.string()
    .valid(...roleValues)
    .optional(),
});

module.exports = async function updateUser(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await userService.updateUser(param(req.params.id), validate);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'User updated',
      data: data.user,
    });
  } catch (error) {
    next(error);
  }
};
