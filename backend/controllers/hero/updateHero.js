const { heroService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

const schema = Joi.object().keys({
  heading: Joi.string().required(),
  subheading: Joi.string().required(),
  description: Joi.string().required(),
  primaryCtaText: Joi.string().optional(),
  primaryCtaHref: Joi.string().optional(),
  secondaryCtaText: Joi.string().optional(),
  imageUrls: Joi.array().items(Joi.string()).optional(),
  enabled: Joi.boolean().optional(),
});

module.exports = async function updateHero(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await heroService.updateHero(validate);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Hero updated',
      data: data.hero,
    });
  } catch (error) {
    next(error);
  }
};
