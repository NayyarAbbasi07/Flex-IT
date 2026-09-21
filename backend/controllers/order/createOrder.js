const { orderService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

const itemSchema = Joi.object().keys({
  productId: Joi.string().uuid().required(),
  size: Joi.string().min(1).required(),
  quantity: Joi.number().integer().min(1).default(1),
  unitPrice: Joi.number().integer().positive().optional(),
});

const schema = Joi.object().keys({
  userId: Joi.string().uuid().allow(null).optional(),
  customerName: Joi.string().min(1).required(),
  phone: Joi.string().min(7).required(),
  city: Joi.string().allow(null, '').optional(),
  whatsappNote: Joi.string().allow(null, '').optional(),
  currency: Joi.string().optional(),
  items: Joi.array().items(itemSchema).min(1).required(),
});

module.exports = async function createOrder(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await orderService.createOrder(validate);
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Order created',
      data: data.order,
    });
  } catch (error) {
    next(error);
  }
};
