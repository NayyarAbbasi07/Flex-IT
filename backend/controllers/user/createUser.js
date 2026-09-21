const { userService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { Role, roleValues } = require('../../common/enumFunction');

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().allow(null, '').optional(),
  role: Joi.string()
    .valid(...roleValues)
    .default(Role.ADMIN),
});

module.exports = async function createUser(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await userService.createUser(validate);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created',
      data: data.user,
    });
  } catch (error) {
    next(error);
  }
};
