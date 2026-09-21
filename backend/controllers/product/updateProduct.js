const { productService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');
const {
  genderValues,
  conditionGradeValues,
  productStatusValues,
} = require('../../common/enumFunction');

const inventorySchema = Joi.object().keys({
  size: Joi.string().min(1).required(),
  quantity: Joi.number().integer().min(0).required(),
  lowStockAt: Joi.number().integer().min(0).optional(),
});

const imageSchema = Joi.object().keys({
  id: Joi.string().uuid().optional(),
  url: Joi.string().min(1).required(),
  alt: Joi.string().optional(),
  sortOrder: Joi.number().integer().optional(),
  isPrimary: Joi.boolean().optional(),
});

const schema = Joi.object().keys({
  name: Joi.string().min(2).optional(),
  slug: Joi.string().optional(),
  sku: Joi.string().optional(),
  description: Joi.string().optional(),
  features: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  brandId: Joi.string().uuid().optional(),
  categoryId: Joi.string().uuid().allow(null).optional(),
  gender: Joi.string().valid(...genderValues).optional(),
  shoeType: Joi.string().optional(),
  condition: Joi.string().valid(...conditionGradeValues).optional(),
  originalBrand: Joi.string().allow(null, '').optional(),
  importedFrom: Joi.string().allow(null, '').optional(),
  color: Joi.string().optional(),
  price: Joi.number().integer().positive().optional(),
  discountPrice: Joi.number().integer().positive().allow(null).optional(),
  featured: Joi.boolean().optional(),
  newArrival: Joi.boolean().optional(),
  bestSeller: Joi.boolean().optional(),
  status: Joi.string().valid(...productStatusValues).optional(),
  inventory: Joi.array().items(inventorySchema).optional(),
  images: Joi.array().items(imageSchema).optional(),
});

module.exports = async function updateProduct(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await productService.updateProduct(param(req.params.id), validate);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Product updated',
      data: data.product,
    });
  } catch (error) {
    next(error);
  }
};
