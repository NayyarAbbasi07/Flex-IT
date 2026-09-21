const { authService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { setAuthCookie } = require('../../utils/jwt');

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  remember: Joi.boolean().optional(),
});

module.exports = async function login(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const remember = validate.remember ?? false;
    const data = await authService.loginUser(validate.email, validate.password, remember);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    setAuthCookie(res, data.auth.token, remember);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logged in',
      data: data.auth,
    });
  } catch (error) {
    next(error);
  }
};
