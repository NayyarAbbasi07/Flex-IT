const { mediaService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

const schema = Joi.object().keys({
  id: Joi.string().uuid().required(),
});

module.exports = async function deleteMedia(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.query, { abortEarly: false });
    const data = await mediaService.deleteMedia(validate.id);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Media deleted',
      data: data.media,
    });
  } catch (error) {
    next(error);
  }
};
