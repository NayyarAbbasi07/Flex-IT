const { categoryService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

const schema = Joi.object().keys({
  id: Joi.string().uuid().required(),
  name: Joi.string().min(1).required(),
  slug: Joi.string().optional(),
  description: Joi.string().allow(null, '').optional(),
  imageUrl: Joi.string().allow(null, '').optional(),
  enabled: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().optional(),
});

module.exports = async function updateCategory(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const { id, ...payload } = validate;
    const data = await categoryService.updateCategory(id, payload);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Category updated',
      data: data.category,
    });
  } catch (error) {
    next(error);
  }
};
