const { orderService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');
const { orderStatusValues } = require('../../common/enumFunction');

const schema = Joi.object().keys({
  customerName: Joi.string().min(1).optional(),
  phone: Joi.string().min(7).optional(),
  city: Joi.string().allow(null, '').optional(),
  whatsappNote: Joi.string().allow(null, '').optional(),
  status: Joi.string().valid(...orderStatusValues).optional(),
});

module.exports = async function updateOrder(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await orderService.updateOrder(param(req.params.id), validate);
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Order updated',
      data: data.order,
    });
  } catch (error) {
    next(error);
  }
};
