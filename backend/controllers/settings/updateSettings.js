const { settingsService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

const schema = Joi.object().pattern(Joi.string(), Joi.string());

module.exports = async function updateSettings(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await settingsService.upsertStoreSettings(validate);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Settings updated',
      data: data.settings,
    });
  } catch (error) {
    next(error);
  }
};
