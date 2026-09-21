const { brandService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

const schema = Joi.object().keys({
  name: Joi.string().min(1).required(),
  slug: Joi.string().optional(),
  description: Joi.string().allow(null, '').optional(),
  logoUrl: Joi.string().allow(null, '').optional(),
  featured: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().optional(),
});

module.exports = async function createBrand(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await brandService.createBrand(validate);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Brand created',
      data: data.brand,
    });
  } catch (error) {
    next(error);
  }
};
