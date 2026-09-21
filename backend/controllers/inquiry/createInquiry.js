const { inquiryService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { inquirySourceValues } = require('../../common/enumFunction');

const schema = Joi.object().keys({
  productId: Joi.string().uuid().allow(null).optional(),
  size: Joi.string().allow(null, '').optional(),
  name: Joi.string().min(1).required(),
  phone: Joi.string().min(7).required(),
  email: Joi.string().email().allow(null, '').optional(),
  city: Joi.string().allow(null, '').optional(),
  message: Joi.string().allow('').optional(),
  source: Joi.string().valid(...inquirySourceValues).optional(),
});

module.exports = async function createInquiry(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await inquiryService.createInquiry(validate, req.user);
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Inquiry submitted',
      data: data.inquiry,
    });
  } catch (error) {
    next(error);
  }
};
